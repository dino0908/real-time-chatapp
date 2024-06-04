import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import pkg from 'body-parser';

const { json } = pkg;
const app = express();
const server = createServer(app);
const userSocketMap = {};
const onlineStatusMap = {};
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(json());

io.on("connection", (socket) => {
  socket.on("setUserID", (userID) => {
    userSocketMap[userID] = socket.id;
  });


  socket.on("chat message", async (data) => {
    try {
      console.log("Received chat message:", data);
      const toUserID = data.toUserID
      // Emit the message directly to the specific recipient's socket
      const recipientSocketID = userSocketMap[toUserID];
      if (recipientSocketID) {
        io.to(recipientSocketID).emit("chat message", {
          text: data.text,
          toUsername: data.toUsername,
          toUserID: toUserID,
          fromUserID: data.fromUserID,
          fromUsername: data.fromUsername
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("login", async (clientUID) => {
    try {
      //store mapping between clientUID and online status
      onlineStatusMap[clientUID] = true;
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("logout", async (clientUID) => {
    try {
      //store mapping between clientUID and online status
      onlineStatusMap[clientUID] = false;
    } catch (error) {
      console.log(error);
    }
  });

  //on loading of friends in friends list, emit an event to server with the friend UID, server returns true or false
  
  socket.on("disconnect", () => {
    const disconnectedUserID = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    if (disconnectedUserID) {
      delete userSocketMap[disconnectedUserID];
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
