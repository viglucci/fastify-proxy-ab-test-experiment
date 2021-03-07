const Fastify = require('fastify');
const throng = require('throng');

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getVariant() {
    const rand = randomIntFromInterval(0, 99);
    return rand >= 49 ? "B" : "A";
}

const port = process.env.TARGET_PORT || 3000;
const targetPort = process.env.PROXY_PORT || 3001;

const proxy = Fastify({
    logger: process.env.LOGGING || false,
    undici: {
        connections: 128,
        pipelining: 1,
        keepAliveTimeout: 60 * 1000,
        tls: {
            rejectUnauthorized: false
        }
    }
});

proxy.register(require('under-pressure'), {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 100000000,
    maxRssBytes: 100000000,
    maxEventLoopUtilization: 0.98,
    message: 'Service Unavailable'
});

proxy.register(require('fastify-reply-from'), {
    base: `http://localhost:${targetPort}/`
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

throng({
    workers: 4,
    worker: (id) => {
        proxy.listen(port, (err) => {
            if (err) {
                throw err
            }
            proxy.log.info(`Proxy worker ${id} listening on port ${port}`);
        });
    }
});
