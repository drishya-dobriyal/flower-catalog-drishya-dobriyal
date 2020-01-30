const fs = require('fs');

const {
  updateComments,
  loadComments,
  createTemplates
} = require('./commentLib');

const CONTENT_TYPE = require('./mimeTypes');
const STATIC_FOLDER = `${__dirname}/../public`;

const pageNotFound = function (request, response) {
  const errorCode = 404;
  response.writeHead(errorCode);
  response.end('Not Found');
};

const serveGuestPageComment = function (request, response) {
  const previousComments = loadComments();
  let data = '';
  request.setEncoding('utf8');
  request.on('data', chunk => {
    data += chunk;
  });
  request.on('end', () => {
    const updatedComments = updateComments(data, previousComments);
    fs.writeFileSync('./dataBase/comments.json', updatedComments);
    const redirectionCode = 303;
    response.writeHead(redirectionCode, { 'location': '/guestBooks.html' });
    response.end();
  });
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

module.exports = {
  serveStaticPage,
  serveGuestPage,
  serveGuestPageComment,
  pageNotFound
};
