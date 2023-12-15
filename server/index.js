const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
const bodyParser = require("body-parser");
const cors = require("cors");

const registeredUsers = [];
const usernameSocketIDMapping = {};

const { signUp, getUser } = require("./auth/firebase")

app.use(cors());
app.use(bodyParser.json());

app.post("/signup", (req, res) => {
  const email = req.body.email
  const password = req.body.password
  signUp(email, password)
  .then((response) => {
    res.status(200).json({ success: true, message: "Signup successful" })
  })
  .catch((error) => {
    console.log(error.message);
  })
});

app.get('/getUser', (req, res) => {
  getUser()
  .then((response) => {
    console.log(response.reloadUserInfo.localId)
  })
  .catch((error) => {
    console.log(error.message)
  })
  
})

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
