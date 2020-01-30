const { App } = require('./app');
const {
  readBody,
  serveStaticPage,
  serveGuestPageComment,
  serveGuestPage,
  pageNotFound,
  methodNotAllowed
} = require('./handlers');

const app = new App();

app.use(readBody);
app.get('', serveStaticPage);
app.get('/guestBooks.html', serveGuestPage);
app.post('/guestBooks.html', serveGuestPageComment);
app.get('', pageNotFound);
app.post('', pageNotFound);
app.use(methodNotAllowed);

module.exports = { app };
