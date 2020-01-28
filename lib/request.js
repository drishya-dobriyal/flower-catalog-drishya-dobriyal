const collectHeadersAndBody = function (result, line) {
  if (line === '') {
    result.body = '';
    return result;
  }
  if ('body' in result) {
    result.body += line;
    return result;
  }
  const [key, value] = line.split(': ');
  result.headers[key] = value;
  return result;
};

const replaceURI = data => {
  data = data.replace(/\+/g, ' ');
  return decodeURIComponent(data);
};

const pickUpParams = function (query, keyValue) {
  const [key, value] = keyValue.split('=');
  query[key] = replaceURI(value);
  return query;
}

const readParams = keyValuePairs => keyValuePairs.split('&').reduce(pickUpParams, {});

class Request {
  constructor(method, url, headers, body) {
    this.method = method;
    this.url = url;
    this.headers = headers;
    this.body = body;
  }
  static parse(text) {
    const [requestLine, ...headersAndBody] = text.split('\r\n');
    let { headers, body } = headersAndBody.reduce(collectHeadersAndBody, { headers: {} });
    const [method, url, protocol] = requestLine.split(' ');
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      body = readParams(body);
    }
    const req = new Request(method, url, headers, body);
    return req;
  }
};

module.exports = Request;