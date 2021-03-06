const Fastify = require('fastify');
const throng = require('throng');

const port = process.env.TARGET_PORT || 3001;

const target = Fastify({
    logger: process.env.LOGGING || false,
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

throng({
    workers: 2,
    worker: (id) => {
        target.listen(port, (err) => {
            if (err) {
                throw err
            }
            target.log.info(`Target worker ${id} listening on port ${port}`);
        });
    }
});
