const socketIo = require("socket.io");
const { Chat } = require("../Model/Chat");
const AuthMiddleware = require("../MiddleWare/AuthMiddleware");
require("../Model/User");
require("../Model/Notifications");

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a student helper at the Ethiopian Defence university. Your task is to guide them with school-related questions. Feel free to ask me any question related to the school, and I will try to answer it.",
});

const generationConfig = {
  temperature: 0.9,
  topP: 1,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

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
          date: new Date(),
        });

        if (room === "ask" && msg.message.startsWith("/ask")) {
          await handleAIQuery(socket, msg.message, userId, room);
        }
      } catch (err) {
        console.error("Error handling chat message:", err);
      }
    });

    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
    });
  });

  return io;
};

const handleAIQuery = async (socket, userQuery, userId, room) => {
  try {
    const query = userQuery.replace("/ask", "").trim();
    const parts = [{ text: query }];
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });

    const aiResponse =
      (await result.response.text()) ||
      "Sorry, I couldn't understand the question.";
    console.log("AI Response:", aiResponse);


    const aiChat = new Chat({
      message: aiResponse,
      sender: null, // AI user ID
      room,
    });

    await aiChat.save();

    io.to(room).emit("message", {
      sender: null,
      message: aiResponse,
      date: new Date(),
    });

    // Emit the AI response back to the sender
  } catch (err) {
    console.error("Error with AI response:", err);
    const errorMsg = "Sorry, I couldn't process your request at this moment.";
    io.to(room).emit("message", {
      sender: "674b79e1e956748e8b899376",
      message: errorMsg,
      date: new Date(),
    });
  }
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return { io, userSocketMap };
};

module.exports = { initializeSocket, getIo };
