const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');

// Serve React app
app.use(express.static(path.join(__dirname, '../client/react/dist')));

// Serve index.html for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/react/', 'index.html'));
});


io.on("connection", (socket) => {
  socket.on("chat message", (data) => {
    console.log('here', data);
    var msg = data.inp;
    var userId = data.userId;
    var username = accounts[userId];
    io.emit("chat message", { username, msg });
  });

  socket.on("set username", (data) => {
    console.log('data', data);
    if (!usernames.includes(data.username)) {
      //handle set username
      usernames.push(data.username);
      accounts[data.userId] = data.username;

    } else {
      console.log('username ' + data.username + ' taken, sorry!');
    }
    console.log('usernames: ', usernames);
    console.log('accounts: ', accounts);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
