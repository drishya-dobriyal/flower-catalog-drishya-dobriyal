const fs = require('fs');

const STATIC_FOLDER = `${__dirname}/../public`;
const CONTENT_TYPE = require('./mimeTypes');
const {
  updateComments,
  loadComments,
  createTemplates
} = require('./commentLib');

const readBody = (request, response, next) => {
  let data = '';
  request.setEncoding('utf8');
  request.on('data', chunk => {
    data += chunk;
  });
  request.on('end', () => {
    request.body = data;
    next();
  });
};

const isFilePresent = path => {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const serveStaticPage = (request, response, next) => {
  if (request.url === '/') {
    request.url = '/index.html';
  }
  const path = `${STATIC_FOLDER}${request.url}`;
  if (isFilePresent(path)) {
    return next();
  }
  const content = fs.readFileSync(path);
  const [, extension] = path.match(/.*\.(.*)/);
  response.setHeader('content-type', CONTENT_TYPE[extension]);
  response.write(content);
  response.end();
};

const serveGuestPageComment = function (request, response) {
  const previousComments = loadComments();
  updateComments(request.body, previousComments);
  const redirectionCode = 303;
  response.writeHead(redirectionCode, { 'location': '/guestBooks.html' });
  response.end();
};

const serveGuestPage = function (request, response) {
  const guestPage = fs.readFileSync('./templates/guestBooks.html', 'utf8');
  const commentList = loadComments();
  const comments = commentList.map(createTemplates);
  const updatedPage = guestPage.replace('__Comments__', comments.join('\n'));
  response.setHeader('content-type', CONTENT_TYPE.html);
  response.write(updatedPage);
  response.end();
};

const pageNotFound = function (request, response) {
  const errorCode = 404;
  response.writeHead(errorCode);
  response.end('Not Found');
};

const methodNotAllowed = function (req, res) {
  const status = 400;
  res.writeHead(status, 'Method Not Allowed');
  res.end();
};

module.exports = {
  readBody,
  serveStaticPage,
  serveGuestPage,
  serveGuestPageComment,
  pageNotFound,
  methodNotAllowed
};
