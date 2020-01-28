const http = require('http');
const { serveStaticPage, serveHomePage } = require('./lib/serveStaticPage');
const { serveGuestPageComment, serveGuestPage } = require('./lib/serveGuestPages');

const findHandler = function (request) {
  if (request.method === 'GET' && request.url === '/guestBooks.html') return serveGuestPage;
  if (request.method === 'POST' && request.url === '/guestBooks.html') return serveGuestPageComment;
  if (request.method === 'GET' && request.url === '/') return serveHomePage;
  if (request.method === 'GET') return serveStaticPage;
};

const handleConnection = (request, response) => {
  const handler = findHandler(request);
  handler(request, response);
};

const main = function () {
  const server = new http.Server(handleConnection);
  server.listen(4000);
};

main();