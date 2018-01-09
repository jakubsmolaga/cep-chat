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
  let room;
  let color;

  socket.on('join', (params, callback) => {
    if(!isRealString(params.nickname) || !isRealString(params.room)){
      return callback('name and room are required');
    }
    let roaster = io.of('/').adapter.rooms[params.room];
    let nicknames = [];
    let colors = [];
    if(roaster){
      for(id in roaster.sockets){
        if(io.of('/').adapter.nsp.connected[id].nickname === params.nickname)
          return callback('User with this name already exists in this room');
      }
      for(id in roaster.sockets){
        nicknames.push(io.of('/').adapter.nsp.connected[id].nickname);
        colors.push(io.of('/').adapter.nsp.connected[id].color);
      }
    }

    nicknames.push(params.nickname);
    console.log(nicknames);
    socket.nickname = params.nickname;
    room = params.room;
    color = Math.floor(Math.random()*16777215).toString(16);
    socket.color = color;
    colors.push(color);
    console.log(colors);
    socket.join(room);

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to cep chat!'));
    socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${socket.nickname} joined the room!`));
    io.to(room).emit('users_update', {nicknames, colors});
    callback();
  });

  socket.on('createMessage', (message , callback) => {
    console.log('Message created', message);
    io.to(room).emit('newMessage', generateMessage(socket.nickname, message.text, color));
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage(socket.nickname, coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('client disconnected');
    socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${socket.nickname} left the room!`));
    let roaster = io.of('/').adapter.rooms[room];
    let nicknames = [];
    let colors = [];
    if(roaster){
      for(id in roaster.sockets){
        nicknames.push(io.of('/').adapter.nsp.connected[id].nickname);
        colors.push(io.of('/').adapter.nsp.connected[id].color);
      }
    }
    socket.broadcast.to(room).emit('users_update', {nicknames, colors});
  })
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
