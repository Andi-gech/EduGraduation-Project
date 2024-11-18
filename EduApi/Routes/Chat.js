const socketIo = require("socket.io");
const { Chat } = require("../Model/Chat");
const AuthMiddleware = require("../MiddleWare/AuthMiddleware");
require("../Model/User");
require("../Model/Notifications");

let io;
let userSocketMap = new Map();

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      await AuthMiddleware(socket.request, {}, next);
    } catch (err) {
      next(err);
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.request.user.userid;

    userSocketMap.set(userId, socket.id);

    socket.on("joinRoom", (room) => {
      if (socket.currentRoom !== room) {
        socket.leave(socket.currentRoom);
        socket.join(room);
        socket.currentRoom = room;
      }
    });

    socket.on("chatMessage", async (msg) => {
      try {
        const room = socket.currentRoom;
        if (!room) throw new Error("Room not defined");

        const chat = new Chat({
          message: msg.message,
          sender: userId,
          room,
        });

        await chat.save();
        socket.to(room).emit("message", {
          sender: userId,
          message: msg.message,
        });
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return { io, userSocketMap };
};

module.exports = { initializeSocket, getIo };
