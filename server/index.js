const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const bodyParser = require('body-parser');
const cors = require('cors');

const registeredUsers = [];

app.use(cors());
app.use(bodyParser.json());

app.post('/api/register', (req, res) => {
  const username = req.body.username;
  // Username input validation
  if (registeredUsers.includes(username.toLowerCase()) == false) {
    console.log('User registered:', username);
    registeredUsers.push(username.toLowerCase());
    res.status(200).json({ success: true, message: 'Registration successful' });
  } else {
    console.log('Username taken, please try again!');
    res.status(200).json({ success: false, message: 'Username taken, please try again!'});
  }

  
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
