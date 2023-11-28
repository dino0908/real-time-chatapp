const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { v4: uuidv4 } = require('uuid');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
  });

const registeredUsers = {};

io.on('connection', (socket) => {

    

    socket.on('chat message', (msg) => {
        const username = registeredUsers[socket.userId];
        io.emit('chat message', {username, msg});
      });

    socket.on('set username', (username) => {
        const userId = uuidv4();
        registeredUsers[userId] = username;
        socket.userId = userId;
    })
  });

server.listen(8080, () => {
  console.log('listening on port:8080');
});