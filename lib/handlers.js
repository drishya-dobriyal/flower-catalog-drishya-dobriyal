const fs = require('fs');
const queryString = require('querystring');

const CONTENT_TYPE = require('./mimeTypes');
const STATIC_FOLDER = `${__dirname}/../public`

const pageNotFound = function (request, response, next) {
  response.writeHead(404);
  response.end('Not Found');
};

const loadComments = () => {
  const comments = fs.readFileSync('./dataBase/comments.json');
  return JSON.parse(comments);
};

const createTemplates = function ({ userName, userComment, dateAndTime }) {
  const date = new Date(dateAndTime).toLocaleDateString();
  const time = new Date(dateAndTime).toLocaleTimeString();
  userComment = userComment.replace(/(\r\n)/g, '<br>');
  return `<tr> 
    <td>${date}</td> 
    <td>${time}</td> 
    <td>${userName}</td> 
    <td>${userComment}</td>
  </tr>`;
};

const updateComments = function (newComment, currentComments) {
  const { userName, userComment } = queryString.parse(newComment);
  const dateAndTime = new Date();
  currentComments.unshift({ userName, userComment, dateAndTime });
  return JSON.stringify(currentComments);
};

const serveGuestPageComment = function (request, response) {
  const previousComments = loadComments();
  let data = '';
  request.setEncoding('utf8');
  request.on('data', chunk => {
    data += chunk;
  });
  request.on('end', () => {
    const updatedComments = updateComments(data, previousComments)
    fs.writeFileSync('./dataBase/comments.json', updatedComments);
    response.writeHead(303, { 'location': '/guestBooks.html' });
    response.end();
  });
};

const serveGuestPage = function (request, response) {
  const guestPageHtml = fs.readFileSync('./templates/guestBooks.html', 'utf8');
  const commentList = loadComments();
  const comments = commentList.map(createTemplates);
  const updatedGuestPage = guestPageHtml.replace('__Comments__', comments);
  response.writeHead(200, { 'content-type': CONTENT_TYPE.html });
  response.write(updatedGuestPage);
  response.end();
};

const serveStaticPage = (request, response, next) => {
  if (request.url === '/') {
    request.url = '/index.html'
  }
  const path = `${STATIC_FOLDER}${request.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) {
    return next();
  };
  const content = fs.readFileSync(path);
  const [, extension] = path.match(/.*\.(.*)/);
  response.writeHead(200, { 'content-type': CONTENT_TYPE[extension] });
  response.write(content);
  response.end();
};

module.exports = { serveStaticPage, serveGuestPage, serveGuestPageComment, pageNotFound };