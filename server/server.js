const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new client connected');
  let nickname;
  let room;
  let color;

  socket.on('join', (params, callback) => {
    if(!isRealString(params.nickname) || !isRealString(params.room)){
      return callback('name and room are required');
    }

    nickname = params.nickname;
    room = params.room;
    color = Math.floor(Math.random()*16777215).toString(16);
    socket.join(room);

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to cep chat!'));
    socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${nickname} joined the room!`));
    callback();
  });

  socket.on('createMessage', (message , callback) => {
    console.log('Message created', message);
    io.to(room).emit('newMessage', generateMessage(nickname, message.text, color));
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('client disconnected');
    socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${nickname} left the room!`));
  })
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
