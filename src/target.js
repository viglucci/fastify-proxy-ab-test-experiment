const Fastify = require('fastify');
const throng = require('throng');

const target = Fastify({
    logger: false
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

const port = process.env.PORT || 3001;

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
