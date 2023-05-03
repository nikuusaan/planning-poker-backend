import {
  createRoom,
  joinRoom,
  leaveRoom,
  deleteRoom,
  startVoting,
  submitVote,
  revealVotes,
  resetRound,
} from "../controllers/roomController.js";

const roomRoutes = (io) => {
  io.on("connection", (socket) => {
    socket.on("createRoom", (roomID) => createRoom(socket, roomID, io));
    socket.on("joinRoom", (data) => joinRoom(socket, data, io));
    socket.on("leaveRoom", (roomID, userID) =>
      leaveRoom(socket, roomID, userID, io)
    );
    socket.on("deleteRoom", (roomID) => deleteRoom(socket, roomID));
    socket.on("startVoting", (roomID) => startVoting(socket, roomID, io));
    socket.on("submitVote", (data) => submitVote(socket, data, io));
    socket.on("revealVotes", (roomID) => revealVotes(socket, roomID, io));
    socket.on("resetRound", (roomID) => resetRound(socket, roomID, io));
  });
};

export default roomRoutes;
