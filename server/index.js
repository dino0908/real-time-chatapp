import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import pkg from 'body-parser';
const { json } = pkg;
const app = express();
const server = createServer(app);
const userSocketMap = {};

//key - socketid, value - userid
//on login, add the mapping onlineStatusMap[socket.id] = userid
//on logout remove the mapping delete onlineStatusMap[socket.id];

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

  socket.on("login", async (uid) => {
    try {
      //store mapping between clientUID and online status
      onlineStatusMap[socket.id] = uid; //okay
      console.log(onlineStatusMap)
    } catch (error) {
      console.log(error);
    }
  });

  // socket.on("logout", async () => {
  //   try {
  //     //store mapping between clientUID and online status
  //     delete onlineStatusMap[socket.id]
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
  socket.on("logout", async (userID) => {
    try {
      // Find the socket ID associated with the user ID
      const userSocketID = Object.keys(onlineStatusMap).find(
        (key) => onlineStatusMap[key] === userID // Find key with value matching userID
      );
      if (userSocketID) {
        delete onlineStatusMap[userSocketID];
        console.log(`User ${userID} logged out.`); // Optional logging
        // Broadcast updated online status to all clients (optional)
      } else {
        console.log(`User with ID ${userID} not found in onlineStatusMap`); // Optional logging for debugging
      }
    } catch (error) {
      console.error("Error handling logout:", error);
    }
  });


  // Emit the response back to the client
      // console.log('test friendstatuses', friendStatuses)
      // test friendstatuses { dino 2 friends showing with boolean
      //   '2FdLqICmcoNpTXPxmDU3acpOAiQ2': false,
      //   XSY8ELiKTrTJC9GvpCEVG2RLcCJ2: false
      // }
    socket.on("getOnlineStatuses", async (friendIDs) => { //friendIDs is correct
      const friendStatuses = {}; // Object to hold friend online statuses id/status
      // for (const id of friendIDs) {
      //   if (id) {
      //     friendStatuses[id] = onlineStatusMap.hasOwnProperty(id);
      //   }
      // }
      for (const id of friendIDs) {
        if (id) {
          // Efficiently check if id exists in onlineStatusMap (using includes)
          const isFriendOnline = Object.values(onlineStatusMap).includes(id);
          friendStatuses[id] = isFriendOnline; // Set online status based on existence in map
        }
      }
      socket.emit("onlineStatusResponse", friendStatuses);
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
