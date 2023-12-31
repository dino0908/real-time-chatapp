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

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
