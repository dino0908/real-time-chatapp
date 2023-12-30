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

io.on("connection", (socket) => {
  socket.on("chat message", async (data) => {
    try {
      console.log("Received chat message:", data);
      const toUsername = data.toUsername;
      const toUserID = await getUserIDFromUsername(toUsername);
      io.emit("chat message", {
        text: data.text,
        toUserID: toUserID,
        fromUserID: data.fromUserID,
      });
    } catch (error) {
      console.log(error);
    }
    //do processing of username in data to userid and emit back
  });

  socket.on("disconnect", () => {
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

app.post("/signup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  try {
    const usernameTaken = await checkUsernameTaken(username);
    if (usernameTaken) {
      const emailTaken = await checkEmailTaken(email);
      if (usernameTaken && emailTaken) {
        res
          .status(200)
          .json({ success: false, message: "Username and email taken" });
      } else {
        res.status(200).json({ success: false, message: "Username taken" });
      }
    } else {
      await signUp(email, password);
      res.status(200).json({ success: true, message: "Signup successful" });
      const getUserResponse = await getUserID();
      const userID = getUserResponse.reloadUserInfo.localId;
      await addUserToDatabase(email, username, userID);
      console.log("User added to database");
    }
  } catch (error) {
    if (error.code == "auth/email-already-in-use") {
      res.status(200).json({ success: false, message: "Email taken" });
    }
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
    await deleteChat(username1, username2);
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
