const extractData = dataText => {
  let [, data] = dataText.split('=');
  data = data.replace(/\+/g, ' ').replace(/\%0D\%0A/g, '\r\n');
  return data;
};

const formatComment = function (newComment) {
  const [userName, userComment] = newComment.split('&');
  const name = extractData(userName);
  const comment = extractData(userComment);
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString()
  return { name, comment, date, time };
};

const updateComments = function (newComment, previousComments) {
  const { name, comment, date, time } = formatComment(newComment);
  const currentComments = JSON.parse(previousComments);
  currentComments.unshift({ name, comment, date, time });
  return JSON.stringify(currentComments);
};

module.exports = { updateComments };