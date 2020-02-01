const queryString = require('querystring');
const fs = require('fs');
const { DATA_STORE } = require('../config');

const STATIC_FOLDER = `${__dirname}/../public`;

const CONTENT_TYPE = require('./mimeTypes');
const {
  Comment,
  Comments
} = require('./comment');

const comments = Comments.load(fs.readFileSync(DATA_STORE, 'utf8'));

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

const isFileNOTPresent = path => {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const serveStaticPage = (request, response, next) => {
  if (request.url === '/') {
    request.url = '/index.html';
  }
  const path = `${STATIC_FOLDER}${request.url}`;
  if (isFileNOTPresent(path)) {
    return next();
  }
  const content = fs.readFileSync(path);
  const [, extension] = path.match(/.*\.(.*)/);
  response.setHeader('content-type', CONTENT_TYPE[extension]);
  response.write(content);
  response.end();
};

const serveGuestPageComment = function (request, response) {
  // const comments = Comments.load(fs.readFileSync(DATA_STORE, 'utf8'));
  request.body = queryString.parse(request.body);
  const { name, comment } = request.body;
  const newComment = new Comment(name, comment, new Date());
  comments.addComment(newComment);
  fs.writeFileSync(DATA_STORE, comments.stringify());
  const redirectionCode = 303;
  response.writeHead(redirectionCode, { 'location': '/guestBooks.html' });
  response.end();
};

const serveGuestPage = function (request, response) {
  const path = `${__dirname}/../templates/guestBooks.html`;
  // const comments = Comments.load(fs.readFileSync(DATA_STORE, 'utf8'));
  const commentsAsHtml = comments.toHTML();
  const guestPage = fs.readFileSync(path, 'utf8');
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
