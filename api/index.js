const app = require('../artifacts/api-server/dist/handler.cjs');
module.exports = app.default ?? app;
