const Fastify = require('fastify');

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getVariant() {
    const number = randomIntFromInterval(0, 99);
    if (number >= 49) {
        return "B";
    }
    return "A";
}

const proxy = Fastify({
    logger: true
});

proxy.register(require('fastify-reply-from'), {
    base: 'http://localhost:3001/'
});

proxy.get('*', (request, reply) => {
    const variant = getVariant();
    const { query } = request;
    reply.from(request.url, {
        queryString: {
            variant,
            ...query
        }
    });
});

proxy.listen(3000, (err) => {
    if (err) {
        throw err
    }
});