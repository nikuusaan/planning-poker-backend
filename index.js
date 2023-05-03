import express from "express";
import http from "http";
import { Server } from "socket.io";
import roomRoutes from "./routes/roomRoutes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));
roomRoutes(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
