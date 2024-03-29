import express from "express";
const app = express();
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import roomRouter from "./routes/room.js";

dotenv.config();

const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());
const server = createServer(app);
import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PATCH"],
    transports: ["websocket", "polling"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId, user) => {
    socket.join(roomId.toString());
    socket.to(roomId.toString()).emit("userConnected", user);
  });
  socket.on("updateRoom", (roomPatchInfo) => {
    socket.to(roomPatchInfo._id).emit("getUpdatedRoom", roomPatchInfo);
  });
  socket.on("updateUser", (roomId, userPatchInfo) => {
    socket.to(roomId.toString()).emit("getUpdatedUser", userPatchInfo);
  });
  socket.on("story:update", (roomId, storyPatchInfo) => {
    socket.to(roomId.toString()).emit("getUpdatedStory", storyPatchInfo);
  });
  socket.on("story:create", (roomId, newStory) => {
    io.in(roomId.toString()).emit("newStory", newStory);
  });
  socket.on("story:delete", (roomId, storyId) => {
    io.in(roomId.toString()).emit("deleteStory", storyId);
  });
  socket.on("user:resetStoryPoint", (roomId) => {
    io.in(roomId.toString()).emit("resetStoryPoint");
  });
  socket.on("disconnecting", () => {
    if (socket.rooms.size > 1) {
      const [socketId, ...roomIds] = socket.rooms;
      roomIds.forEach((roomId) => {
        RoomModel.updateOne(
          { _id: roomId },
          { $pull: { users: { _id: socketId } } },
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              io.in(roomId).emit("removeUser", socketId);
            }
          }
        );
      });
    }
  });
});

app.use("/room", roomRouter);

server.listen(port, () => {
  console.log("Server runs!");
});
