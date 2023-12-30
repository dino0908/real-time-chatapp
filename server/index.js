import express from "express";
const app = express();
import { createServer } from "http";
const server = createServer(app);
import { Server } from "socket.io";
import pkg from 'body-parser';
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const { json } = pkg;
import cors from "cors";

import {
  signUp,
  getUserID,
  addUserToDatabase,
  checkUsernameTaken,
  checkEmailTaken,
  signIn,
  getUsername,
  getUsernames,
  startChat,
  getUserIDFromUsername,
  listOfUsernamesClientInActiveChatWith,
  deleteChat,
} from "../client/react/src/firebase.js";

app.use(cors());
app.use(json());

const userSocketMap = {};

io.on("connection", (socket) => {
  socket.on("setUserID", (userID) => {
    // Associate the socket ID with the user ID
    userSocketMap[userID] = socket.id;
  });

  socket.on("chat message", async (data) => {
    try {
      console.log("Received chat message:", data);
      const toUsername = data.toUsername;
      const toUserID = await getUserIDFromUsername(toUsername);

      // Emit the message directly to the specific recipient's socket
      const recipientSocketID = userSocketMap[toUserID];
      if (recipientSocketID) {
        io.to(recipientSocketID).emit("chat message", {
          text: data.text,
          toUserID: toUserID,
          fromUserID: data.fromUserID,
          fromUsername: data.fromUsername
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    // Remove the mapping when a user disconnects
    const disconnectedUserID = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    if (disconnectedUserID) {
      delete userSocketMap[disconnectedUserID];
    }

    console.log("User disconnected");
  });
});



app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    await signIn(email, password);
    res.status(200).json({ success: true, message: "User signed in" });
  } catch (error) {
    console.log(error);
    res.status(200).json({ success: false, message: "Sign in unsuccessful" });
  }
});

app.post("/signup", async (req, res) => { //handle adding to db only, not signup
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const userID = req.body.userID

  try {
      await addUserToDatabase(email, username, userID);
      console.log("User added to database");
      res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
  }
});

app.get("/getUser", async (req, res) => {
  try {
    const getUserIDResponse = await getUserID();
    const userID = getUserIDResponse.reloadUserInfo.localId;
    const getUsernameResponse = await getUsername(userID);
    res
      .status(200)
      .json({ success: true, id: userID, username: getUsernameResponse });
  } catch (error) {
    console.log(error);
  }

  app.post("/getUsernames", async (req, res) => {
    try {
      const search = req.body.search;
      const username = req.body.username;
      const usernames = await getUsernames(search, username);
      res.status(200).json({ success: true, usernames: usernames });
    } catch (error) {
      console.log(error);
      res
        .status(200)
        .json({ success: false, message: "Unexpected error occured" });
    }
  });
});

app.post("/startChat", async (req, res) => {
  try {
    const username1 = req.body.username;
    const username2 = req.body.clickedUsername;
    const userID1 = await getUserIDFromUsername(username1);
    const userID2 = await getUserIDFromUsername(username2);
    startChat(userID1, userID2);
    res.status(200).json({ success: true, message: "New chat started" });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ success: false, message: "Unexpected error occured" });
  }
});

app.post("/activeChats", async (req, res) => {
  try {
    const username = req.body.username;
    const userID = await getUserIDFromUsername(username);
    const listOfUsernames = await listOfUsernamesClientInActiveChatWith(userID);
    res
      .status(200)
      .json({
        success: false,
        message: "Unexpected error occured",
        array: listOfUsernames,
      });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ success: false, message: "Unexpected error occured" });
  }
});

app.post("/deleteChat", async (req, res) => {
  try {
    const username1 = req.body.username1;
    const username2 = req.body.username2;
    
    res
      .status(200)
      .json({ success: true, message: "Successfully deleted chat" });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ success: false, message: "Unexpected error occured" });
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
