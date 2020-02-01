const queryString = require('querystring');
const fs = require('fs');

const STATIC_FOLDER = `${__dirname}/../public`;
const DATA_FOLDER = `${__dirname}/../dataBase/comments.json`;

const CONTENT_TYPE = require('./mimeTypes');
const {
  Comment,
  Comments
} = require('./commentLib');

const readBody = (req, response, next) => {
  let data = '';
  req.setEncoding('utf8');
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      req.body = data;
    }
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
  const previousComments = fs.readFileSync(DATA_FOLDER, 'utf8');
  const comments = Comments.load(previousComments);
  request.body = queryString.parse(request.body);
  const { name, comment } = request.body;
  const newComment = new Comment(name, comment, new Date());
  comments.addComment(newComment);
  fs.writeFileSync(DATA_FOLDER, comments.stringify());
  const redirectionCode = 303;
  response.writeHead(redirectionCode, { 'location': '/guestBooks.html' });
  response.end();
};

const serveGuestPage = function (request, response) {
  const guestPage = fs.readFileSync('./templates/guestBooks.html', 'utf8');
  const comments = Comments.load(fs.readFileSync(DATA_FOLDER, 'utf8'));
  const commentsAsHtml = comments.toHTML();
  const updatedPage = guestPage.replace('__Comments__', commentsAsHtml);
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
