const request = require('supertest');

const { app } = require('../lib/assignHandlers');

describe('GET method', function () {
  it('for home page for / url', function (done) {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
  it('for static html page for any other url', function (done) {
    request(app.serve.bind(app))
      .get('/ageratum.html')
      .set('Accept', '*/*')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
  it('for guest page', function (done) {
    request(app.serve.bind(app))
      .get('/guestBooks.html')
      .set('Accept', '*/*')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
  it('for any other url with given content type', function (done) {
    request(app.serve.bind(app))
      .get('/css/flower.css')
      .set('Accept', '*/*')
      .expect('Content-Type', /css/)
      .expect(200, done);
  });
  it('for url not present', function (done) {
    request(app.serve.bind(app))
      .get('/nonExistingFile')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe.skip('POST /guestBooks.html', function () {
  it('should post the give userName And UserComment', function (done) {
    const data = 'userName=name&userComment=comment';
    request(app.serve.bind(app))
      .post('/guestBooks.html')
      .send(data)
      .set('Accept', '*/*')
      .expect(303, done);
  });
});

describe('method not handled', function () {
  it('error for unhandled method', function (done) {
    request(app.serve.bind(app))
      .put('/index.html')
      .expect(400, done);
  });
});
