const fs = require('fs');

const { Server } = require('net');
const { Request } = require('./lib/request');
const { Response } = require('./lib/response');

const STATIC_FOLDER = `${__dirname}/public`
const CONTENT_TYPE = {
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  json: 'application/json',
  gif: 'image/gif',
  jpg: 'image/jpeg'
};

const serveHomePage = function (request) {
  request.url = '/index.html';
  return serveStaticPage(request);
};

const serveStaticPage = function (request) {
  const path = `${STATIC_FOLDER}${request.url}`;
  const content = fs.readFileSync(path);
  const [, extension] = path.match(/.*\.(.*)/);
  const response = new Response();
  response.statusCode = 200;
  response.setHeaders('Content-Length', content.length);
  response.setHeaders('Content-Type', CONTENT_TYPE[extension]);
  response.body = content;

  return response;
};

const findHandler = function (request) {
  if (request.method === 'GET' && request.url === '/') return serveHomePage;
  if (request.method === 'GET') return serveStaticPage;
  return () => new Response();
};

const handleConnection = function (socket) {
  const remote = `Address : ${socket.remoteAddress}, Port: ${socket.remotePort}`
  console.warn('new Connection', remote);

  socket.setEncoding('utf8');
  socket.on('error', error => console.error(`error in ${remote} : ${error}`));
  socket.on('close', () => console.warn(`${remote} has been closed`));
  socket.on('end', () => console.warn(`${remote} has been ended`));
  socket.on('data', text => {
    const request = Request.parse(text);
    const handler = findHandler(request);
    const response = handler(request);
    response.writeTo(socket);
  })
};

const main = () => {
  const server = new Server();

  server.on('error', error => console.log(`server error : ${error}`));
  server.on('connection', handleConnection);
  server.on('listening', () => console.log('server is listening'));
  server.listen(4000);
};

main();