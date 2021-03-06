const Fastify = require('fastify');

const target = Fastify({
    logger: true
});

target.get('/', (request, reply) => {
    const { variant } = request.query;
    reply.send(`Hello from variant ${variant}!`);
});

target.listen(3001, (err) => {
    if (err) {
        throw err
    }
});