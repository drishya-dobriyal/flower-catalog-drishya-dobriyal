const http = require('http');

const { App } = require('./app');
const { serveStaticPage, serveHomePage, serveGuestPageComment, serveGuestPage, pageNotFound } = require('./lib/handlers');

const app = new App();

app.get('', serveStaticPage);
app.get('/guestBooks.html', serveGuestPage);
app.post('/guestBooks.html', serveGuestPageComment);
app.get('', pageNotFound);
app.post('', pageNotFound);

const server = new http.Server(app.serve.bind(app));

server.listen(4000);