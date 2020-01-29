const fs = require('fs');
const CONTENT_TYPE = require('./mimeTypes');
const queryString = require('querystring');

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

const serveGuestPage = function (request, response) {
  const guestPageHtml = fs.readFileSync('./templates/guestBooks.html', 'utf8');
  const commentList = loadComments();
  const comments = commentList.map(createTemplates);
  const updatedGuestPage = guestPageHtml.replace('__Comments__', comments);
  response.writeHead(200, { 'content-type': CONTENT_TYPE.html });
  response.write(updatedGuestPage);
  response.end();
};

const updateComments = function (newComment, previousComments) {
  const { userName, userComment } = queryString.parse(newComment);
  const dateAndTime = new Date();
  const currentComments = JSON.parse(previousComments);
  currentComments.unshift({ userName, userComment, dateAndTime });
  return JSON.stringify(currentComments);
};

const serveGuestPageComment = function (request, response) {
  const previousComments = fs.readFileSync('./dataBase/comments.json', 'utf8')
  let data = '';
  request.setEncoding('utf8');
  request.on('data', chunk => {
    data += chunk;
    request.on('end', () => {
      const updatedComments = updateComments(data, previousComments)
      fs.writeFileSync('./dataBase/comments.json', updatedComments);
      return serveGuestPage(request, response);
    });
  });
};

module.exports = { serveGuestPage, serveGuestPageComment };