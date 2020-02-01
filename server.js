const http = require('http');

const { app } = require('./lib/assignHandlers');

const server = new http.Server(app.serve.bind(app));

const portNum = 4000;
server.listen(portNum);
