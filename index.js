const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/chat.html");
});


io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log(socket.id);
    const username = 'test';
    io.emit("chat message", { username, msg });
  });

  socket.on("set username", (username) => {
    console.log(socket.id);
  });
});

server.listen(8080, () => {
  console.log("listening on port:8080");
});
