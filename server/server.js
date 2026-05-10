const dns = require("node:dns");
const Room = require("./models/Room");

dns.setServers(["1.1.1.1", "1.0.0.1"]);

const express = require("express");
const cors = require("cors");
const http = require("http");

require("dotenv").config();

const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const codeRoutes = require("./routes/codeRoutes");

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.get("/health", (req, res) => {
  res.send("ok");
});

app.use("/api/auth", authRoutes);

app.use("/api/rooms", roomRoutes);

app.use("/api/code", codeRoutes);

// CREATE HTTP SERVER
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// ONLINE USERS TRACKER
const onlineUsers = {};

const roomCodeState = {};

// SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // JOIN ROOM
  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    // STORE ROOM ID ON SOCKET
    socket.roomId = roomId;

    // CREATE ONLINE USER SET
    if (!onlineUsers[roomId]) {
      onlineUsers[roomId] = new Set();
    }

    // ADD CURRENT USER
    onlineUsers[roomId].add(socket.id);

    console.log(`Users online in ${roomId}:`, onlineUsers[roomId].size);

    // SEND ONLINE COUNT
    io.to(roomId).emit("online-users", onlineUsers[roomId].size);

    // SEND LATEST ROOM STATE
    if (roomCodeState[roomId]) {
      socket.emit("room-state", roomCodeState[roomId]);
    }
  });

  // CODE CHANGE
  socket.on("code-change", ({ roomId, code }) => {
    // UPDATE MEMORY STATE
    if (!roomCodeState[roomId]) {
      roomCodeState[roomId] = {};
    }

    roomCodeState[roomId].code = code;

    // REALTIME BROADCAST
    socket.to(roomId).emit("receive-code", code);
  });

  // LANGUAGE CHANGE
  socket.on("language-change", async ({ roomId, language }) => {
    // BROADCAST TO OTHERS
    if (!roomCodeState[roomId]) {
      roomCodeState[roomId] = {};
    }

    roomCodeState[roomId].language = language;

    socket.to(roomId).emit("receive-language", language);

    try {
      // SAVE TO DB
      await Room.findOneAndUpdate({ roomId }, { language });
    } catch (error) {
      console.log(error);
    }
  });

  // CHAT MESSAGE
  socket.on("send-message", (data) => {
    io.to(data.roomId).emit("receive-message", data);
  });

  // LEAVE ROOM
  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);

    console.log(`User left room: ${roomId}`);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    const roomId = socket.roomId;

    if (roomId && onlineUsers[roomId]) {
      // REMOVE USER
      onlineUsers[roomId].delete(socket.id);

      // DELETE EMPTY ROOM
      if (onlineUsers[roomId].size === 0) {
        delete onlineUsers[roomId];
      }

      // BROADCAST UPDATED COUNT
      io.to(roomId).emit(
        "online-users",
        onlineUsers[roomId] ? onlineUsers[roomId].size : 0,
      );
    }

    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
