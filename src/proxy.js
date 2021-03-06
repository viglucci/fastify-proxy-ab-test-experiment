const Fastify = require('fastify');
const throng = require('throng');

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
    logger: false,
    undici: {
        connections: 128,
        pipelining: 1,
        keepAliveTimeout: 60 * 1000,
        tls: {
            rejectUnauthorized: false
        }
    }
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

const port = process.env.PORT || 3000;

throng({
    workers: 2,
    worker: (id) => {
        proxy.listen(port, (err) => {
            if (err) {
                throw err
            }
            proxy.log.info(`Proxy worker ${id} listening on port ${port}`);
        });
    }
});
