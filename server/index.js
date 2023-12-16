const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const bodyParser = require("body-parser");
const cors = require("cors");

const {
  signUp,
  getUser,
  addUserToDatabase,
  checkUsernameTaken,
} = require("./auth/firebase");

app.use(cors());
app.use(bodyParser.json());

app.post("/signup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  checkUsernameTaken(username)
  .then((taken) => {
    if (taken) {
      res.status(200).json({ success: false, message: "Username taken" });
    } else {
      signUp(email, password)
        .then((response) => {
          res.status(200).json({ success: true, message: "Signup successful" });
          getUser()
            .then((response) => {
              const userID = response.reloadUserInfo.localId;
              addUserToDatabase(email, username, userID).then(() => {
                console.log("User added successfully to database");
              });
            })
            .catch((error) => {
              console.log(error.message);
            });
        })
        .catch((error) => {
          if (error.code == "auth/email-already-in-use") {
            res.status(200).json({ success: false, message: "Email in use" });
          }
        });
    }
  });
});

app.get("/getUser", (req, res) => {
  getUser()
    .then((response) => {
      const userID = response.reloadUserInfo.localId;
      res.status(200).json({ success: true, id: userID });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
