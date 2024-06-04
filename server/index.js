import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import pkg from "body-parser";
const { json } = pkg;
const app = express();
const server = createServer(app);
const userSocketMap = {};
//onlineStatusMap: key - socketid, value - userid
//on login, add the mapping onlineStatusMap[socket.id] = userid
//on logout remove the mapping with the value as the user's id;
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
      const toUserID = data.toUserID;
      // Emit the message directly to the specific recipient's socket
      const recipientSocketID = userSocketMap[toUserID];
      if (recipientSocketID) {
        io.to(recipientSocketID).emit("chat message", {
          text: data.text,
          toUsername: data.toUsername,
          toUserID: toUserID,
          fromUserID: data.fromUserID,
          fromUsername: data.fromUsername,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("login", async (uid) => {
    try {
      //store mapping between clientUID and online status
      onlineStatusMap[socket.id] = uid; //okay
      console.log(onlineStatusMap);
    } catch (error) {
      console.log(error);
    }
  });

  //Socketid is always changing so find the entry using userid instead, delete entry if found
  socket.on("logout", async (userID) => {
    try {
      // Find the socket ID associated with the user ID
      const userSocketID = Object.keys(onlineStatusMap).find(
        (key) => onlineStatusMap[key] === userID // Find key with value matching userID
      );
      if (userSocketID) {
        delete onlineStatusMap[userSocketID]; //
      } else {
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("getOnlineStatuses", async (friendIDs) => {
    const friendStatuses = {}; // Object to hold friend online statuses id/status
    for (const id of friendIDs) {
      if (id) {
        const isFriendOnline = Object.values(onlineStatusMap).includes(id);
        friendStatuses[id] = isFriendOnline;
      }
    }
    socket.emit("onlineStatusResponse", friendStatuses);
  });

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
