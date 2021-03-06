# fastify-proxy-ab-test-experiment

`npm run start` -> http://localhost:3000/?my-query-param=abc

### Load Test

Install autocannon:

`npm install -g autocannon`

Invoke requests:

`autocannon -w 25 -c 50 http://localhost:3000`
