const Fastify = require('fastify');

const target = Fastify({
    logger: true
});

target.get('/', (request, reply) => {
    const { variant } = request.query;
    reply
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({
            message: `Hello from variant ${variant}!`,
            requestData: {
                query: request.query
            }
        });
});

target.listen(3001, (err) => {
    if (err) {
        throw err
    }
});