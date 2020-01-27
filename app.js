const fs = require('fs');

const STATIC_FOLDER = `${__dirname}/public`
const { Response } = require('./lib/response');
const { updateComments, loadCommentFile } = require('./lib/updateComment');

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

const serveGuestPageComment = request => {
  const currentComments = fs.readFileSync('./commentWithName.json', 'utf8')
  const commentsAfterUpdate = updateComments(request.body, currentComments);
  fs.writeFileSync('./commentWithName.json', commentsAfterUpdate);
  return serveGuestPage(request);
};

const serveGuestPage = request => {
  const guestPageHtml = fs.readFileSync('./templates/guestBooks.html', 'utf8');
  const commentsInString = fs.readFileSync('./commentWithName.json');
  const commentsInJson = JSON.parse(commentsInString);
  const commentsList = commentsInJson.map(({ name, date, comment, time }) => {
    return `<tr> 
    <td>${date}</td> 
    <td>${time}</td> 
    <td>${name}</td> 
    <td>${comment.replace(/(\r\n)/g, '<br>')}</td>
    </tr>`;
  });
  const newHtml = guestPageHtml.replace('__Comments__', commentsList.join('\n'));
  const response = new Response();
  response.statusCode = 200;
  response.setHeaders('Content-Length', newHtml.length);
  response.setHeaders('Content-Type', CONTENT_TYPE.html);
  response.body = newHtml;
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