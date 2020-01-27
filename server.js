const { Server } = require('net');
const Request = require('./lib/request');
const { processText } = require('./app');

const handleConnection = function (socket) {
  const remote = `Address : ${socket.remoteAddress}, Port: ${socket.remotePort}`
  console.warn('new Connection', remote);
  socket.setEncoding('utf8');
  socket.on('error', error => console.error(`error in ${remote} : ${error}`));
  socket.on('close', () => console.warn(`${remote} has been closed`));
  socket.on('end', () => console.warn(`${remote} has been ended`));
  socket.on('data', text => {
    const request = Request.parse(text);
    const response = processText(request);
    response.writeTo(socket);
  })
};

const main = () => {
  const server = new Server();
  server.on('error', error => console.warn(`server error : ${error}`));
  server.on('connection', handleConnection);
  server.on('listening', () => console.warn('server is listening', server.address()));
  server.listen(4000);
};

main();