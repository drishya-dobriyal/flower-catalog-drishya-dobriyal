class Request {
  constructor(method, url) {
    this.method = method;
    this.url = url;
  }
  static parse(text) {
    const [requestLine, ...headersAndBody] = text.split('\r\n');
    const [method, url, protocol] = requestLine.split(' ');
    const req = new Request(method, url);
    return req;
  }
};

module.exports = { Request };