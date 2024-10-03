const serverless = require('serverless-http');
const app = require('./api/aerolineas');

module.exports.handler = serverless(app);
