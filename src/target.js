const Fastify = require('fastify');
const throng = require('throng');

const port = process.env.TARGET_PORT || 3001;

const target = Fastify({
    logger: process.env.LOGGING || false,
});

target.register(require('under-pressure'), {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 100000000,
    maxRssBytes: 100000000,
    maxEventLoopUtilization: 0.98,
    message: 'Service Unavailable'
});

target.get('/', (request, reply) => {
    const { variant } = request.query;
    const performance = target.memoryUsage();
    reply
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({
            message: `Hello from variant ${variant}!`,
            requestData: {
                query: request.query
            },
            performance
        });
});

throng({
    workers: 4,
    worker: (id) => {
        target.listen(port, (err) => {
            if (err) {
                throw err
            }
            target.log.info(`Target worker ${id} listening on port ${port}`);
        });
    }
});
