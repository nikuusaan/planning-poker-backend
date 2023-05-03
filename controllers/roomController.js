const rooms = new Map();

const createRoom = (socket, roomID, io) => {
  if (!rooms.has(roomID)) {
    rooms.set(roomID, {
      users: new Map(),
      gameState: {
        voting: false,
        votesRevealed: false,
        votes: new Map(),
        timer: null,
      },
    });
    socket.join(roomID);
    socket.emit("roomCreated", roomID);
  } else {
    socket.emit("error", "Room already exists");
  }
};

const joinRoom = (socket, { roomID, userID, userName }, io) => {
  if (rooms.has(roomID)) {
    rooms.get(roomID).users.set(userID, { id: userID, name: userName });
    socket.join(roomID);
    socket.emit("roomJoined", roomID);
    io.to(roomID).emit("userJoined", { userID, userName });
  } else {
    socket.emit("error", "Room does not exist");
  }
};

const leaveRoom = (socket, roomID, userID, io) => {
  if (rooms.has(roomID)) {
    rooms.get(roomID).users.delete(userID);
    socket.leave(roomID);
    io.to(roomID).emit("userLeft", userID);
  }
};

const deleteRoom = (socket, roomID) => {
  rooms.delete(roomID);
};

const startVoting = (socket, roomID, io) => {
  if (rooms.has(roomID)) {
    const gameState = rooms.get(roomID).gameState;
    gameState.voting = true;
    gameState.votesRevealed = false;
    gameState.timer = setTimeout(() => {
      revealVotes(socket, roomID, io);
    }, 30000);
    io.to(roomID).emit("votingStarted", 30000);
  }
};

const submitVote = (socket, { roomID, userID, vote }, io) => {
  if (rooms.has(roomID)) {
    const gameState = rooms.get(roomID).gameState;
    if (gameState.voting) {
      gameState.votes.set(userID, vote);
      io.to(roomID).emit("voteSubmitted", userID);
    }
  }
};

const revealVotes = (socket, roomID, io) => {
  if (rooms.has(roomID)) {
    const gameState = rooms.get(roomID).gameState;
    if (gameState.voting) {
      clearTimeout(gameState.timer);
      gameState.voting = false;
      gameState.votesRevealed = true;
      io.to(roomID).emit(
        "votesRevealed",
        Array.from(gameState.votes.entries())
      );
    }
  }
};

const resetRound = (socket, roomID, io) => {
  if (rooms.has(roomID)) {
    const gameState = rooms.get(roomID).gameState;
    gameState.voting = false;
    gameState.votesRevealed = false;
    gameState.votes.clear();
    io.to(roomID).emit("roundReset");
  }
};

export {
  createRoom,
  joinRoom,
  leaveRoom,
  deleteRoom,
  startVoting,
  submitVote,
  revealVotes,
  resetRound,
};
