const queryString = require('querystring');
const fs = require('fs');

const loadComments = () => {
  const comments = fs.readFileSync('./dataBase/comments.json', 'utf8');
  return JSON.parse(comments);
};

const createTemplates = function ({ userName, userComment, dateAndTime }) {
  const date = new Date(dateAndTime).toLocaleDateString();
  const time = new Date(dateAndTime).toLocaleTimeString();
  const comment = userComment.replace(/(\r\n)/g, '<br>');
  return `<tr> 
    <td>${date}</td> 
    <td>${time}</td> 
    <td>${userName}</td> 
    <td>${comment}</td>
  </tr>`;
};

const updateComments = function (newComment, currentComments) {
  const { userName, userComment } = queryString.parse(newComment);
  const dateAndTime = new Date();
  currentComments.unshift({ userName, userComment, dateAndTime });
  return JSON.stringify(currentComments);
};

module.exports = { updateComments, loadComments, createTemplates };
