const fs = require('fs');
const Response = require('./response');
const { updateComments } = require('./updateComment');
const CONTENT_TYPE = require('./mimeTypes');

const loadComments = function () {
  const comments = fs.readFileSync('./dataBase/comments.json');
  return JSON.parse(comments);
};

const createTemplate = function ({ name, date, comment, time }) {
  return `<tr> 
    <td>${date}</td> 
    <td>${time}</td> 
    <td>${name}</td> 
    <td>${comment.replace(/(\r\n)/g, '<br>')}</td>
    </tr>`;
}

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