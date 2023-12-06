const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://dinos3bucket.s3-website-ap-southeast-2.amazonaws.com",
    methods: ["GET", "POST"]
  }
});
const bodyParser = require("body-parser");
const cors = require("cors");

const registeredUsers = [];
const usernameSocketIDMapping = {};

app.use(cors());
app.use(bodyParser.json());

app.post("/api/register", (req, res) => {
  const username = req.body.username;
  // Username input validation
  if (registeredUsers.includes(username.toLowerCase()) == false) {
    console.log("User registered:", username);
    registeredUsers.push(username.toLowerCase());
    res.status(200).json({ success: true, message: "Registration successful" });
  } else {
    console.log("Username taken, please try again!");
    res
      .status(200)
      .json({ success: false, message: "Username taken, please try again!" });
  }
});

app.get("/api/getUsername", (req, res) => {
  var socketId = req.query.socketId;
  var username = usernameSocketIDMapping[socketId];
  console.log(username);
  res.status(200).json({ username: username });
})

io.on("connection", (socket) => {
  socket.on("chat message", (data) => {
    io.emit("chat message", data);
  });

  socket.on("set username", (data) => {
    var username = data.username;
    registeredUsers.push(username.toLowerCase());
    usernameSocketIDMapping[socket.id] = username;
  });

  //socket on disconnect, remove user from mapping
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
