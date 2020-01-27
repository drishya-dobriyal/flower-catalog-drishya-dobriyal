const fs = require('fs');
const CONTENT_TYPE = require('./lib/mimeTypes');
const Response = require('./lib/response');
const { serveGuestPageComment, serveGuestPage } = require('./lib/serveGuestPages');
const STATIC_FOLDER = `${__dirname}/public`

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
  if (request.method === 'GET' && request.url === '/guestBooks.html') return serveGuestPage;
  if (request.method === 'POST' && request.url === '/guestBooks.html') return serveGuestPageComment;
  if (request.method === 'GET' && request.url === '/') return serveHomePage;
  if (request.method === 'GET') return serveStaticPage;
  return () => new Response();
};

const processText = request => {
  const handler = findHandler(request);
  const response = handler(request);
  return response;
};

module.exports = { processText };