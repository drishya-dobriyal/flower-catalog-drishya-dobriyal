const fs = require('fs');
const Response = require('./response');
const CONTENT_TYPE = require('./mimeTypes');

const loadComments = function () {
  const comments = fs.readFileSync('./dataBase/comments.json');
  return JSON.parse(comments);
};

const updateComments = function (newComment, previousComments) {
  const { userName, userComment } = newComment;
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  const currentComments = JSON.parse(previousComments);
  currentComments.unshift({ userName, userComment, date, time });
  return JSON.stringify(currentComments);
};

const createTemplate = function ({ userName, userComment, date, time }) {
  return `<tr> 
    <td>${date}</td> 
    <td>${time}</td> 
    <td>${userName}</td> 
    <td>${userComment}</td>
  </tr>`;
};

const serveGuestPageComment = request => {
  const previousComments = fs.readFileSync('./dataBase/comments.json', 'utf8')
  const updatedComments = updateComments(request.body, previousComments);
  fs.writeFileSync('./dataBase/comments.json', updatedComments);
  return serveGuestPage(request);
};

const serveGuestPage = () => {
  const guestPageHtml = fs.readFileSync('./templates/guestBooks.html', 'utf8');
  const commentList = loadComments();
  const comments = commentList.map(createTemplate);
  const newHtml = guestPageHtml.replace('__Comments__', comments.join('\n'));
  const response = new Response();
  response.statusCode = 200;
  response.setHeaders('Content-Length', newHtml.length);
  response.setHeaders('Content-Type', CONTENT_TYPE.html);
  response.body = newHtml;
  return response;
};

module.exports = { serveGuestPageComment, serveGuestPage };