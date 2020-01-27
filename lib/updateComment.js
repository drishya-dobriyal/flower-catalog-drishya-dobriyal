const fs = require('fs');

const extractData = dataText => {
  let [, data] = dataText.split('=');
  data = data.replace(/\+/g, ' ');
  data = data.replace(/\%0D\%0A/g, '\r\n');
  return data;
};

const formatComment = function (newComment) {
  const [userName, userComment] = newComment.split('&');
  const name = extractData(userName);
  const comment = extractData(userComment);
  let dateAndTime = new Date();
  dateAndTime = dateAndTime.toLocaleString();
  const [date, time] = dateAndTime.split(',');
  return { name, comment, date, time };
};

const updateComments = function (newComment) {
  const { name, comment, date, time } = formatComment(newComment);
  const currentComments = JSON.parse(fs.readFileSync('./commentWithName.json', 'utf8'));
  currentComments.unshift({ name, comment, date, time });
  const commentsInText = JSON.stringify(currentComments);
  fs.writeFileSync('./commentWithName.json', commentsInText);
};

module.exports = { updateComments };