const fs = require('fs');
const CONTENT_TYPE = require('./mimeTypes');

const STATIC_FOLDER = `${__dirname}/../public`

const serveHomePage = function (request, response) {
  request.url = '/index.html';
  return serveStaticPage(request, response);
};

const serveStaticPage = (request, response) => {
  const path = `${STATIC_FOLDER}${request.url}`;
  const content = fs.readFileSync(path);
  const [, extension] = path.match(/.*\.(.*)/);
  response.writeHead(200, { 'content-type': CONTENT_TYPE[extension] });
  response.write(content);
  response.end();
};

module.exports = { serveStaticPage, serveHomePage };