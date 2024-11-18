const express = require("express");
const Router = express.Router();
const { Chatroom } = require("../Model/Chatrooms");
const { User } = require("../Model/User");
const AuthMiddleware = require("../MiddleWare/AuthMiddleware");
const EnsureChatrooms = require("../MiddleWare/EnsureChatrooms");
const { Chat } = require("../Model/Chat");

/**
 * @swagger
 * /chatrooms:
 *   get:
 *     summary: Get chatrooms for the authenticated user
 *     description: Retrieves all chat rooms associated with the authenticated user based on their ID.
 *     tags: [Chatrooms]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: List of chat rooms for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The chatroom ID.
 *                     example: "61f7b2e4c6e9a011d4e87b5f"
 *                   name:
 *                     type: string
 *                     description: The name of the chatroom.
 *                     example: "General Chat"
 *                   user:
 *                     type: string
 *                     description: User ID associated with the chatroom.
 *                     example: "605c72d7f1eabc001d3b8a13"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
Router.get("/", AuthMiddleware, EnsureChatrooms, async (req, res) => {
  const chat = await Chatroom.find({
    user: req.user._id,
  });

  res.send(chat);
});
/**
 * @swagger
 * /chatrooms/room:
 *   get:
 *     summary: Get distinct chat room names
 *     description: Retrieves a list of all unique chat room names.
 *     tags: [Chatrooms]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: List of distinct chat room names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: A unique chat room name.
 *                 example: "General Chat"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
Router.get("/room", AuthMiddleware, async (req, res) => {
  const chat = await Chatroom.distinct("name");
  res.send(chat);
});
/**
 * @swagger
 * /chatrooms:
 *   post:
 *     summary: Create a new chat room
 *     description: Allows an authenticated user to create a new chat room.
 *     tags: [Chatrooms]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the chat room.
 *                 example: "Study Group"
 *     responses:
 *       200:
 *         description: Chat room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the created chat room.
 *                   example: "603d214f8e3fcd1f9c4efb95"
 *                 name:
 *                   type: string
 *                   description: The name of the chat room.
 *                   example: "Study Group"
 *                 user:
 *                   type: string
 *                   description: The ID of the user who created the chat room.
 *                   example: "603d214f8e3fcd1f9c4efb94"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
Router.post("/", AuthMiddleware, async (req, res) => {
  const chat = new Chatroom({
    name: req.body.name,
    user: req.user._id,
  });
  await chat.save();
  res.send(chat);
});
/**
 * @swagger
 * /chatrooms/{name}:
 *   get:
 *     summary: Get chat history of a specific chat room
 *     description: Retrieves the last 20 messages from a specified chat room along with sender details.
 *     tags: [Chatrooms]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the chat room to retrieve the chat history for.
 *         example: "Study Group"
 *     responses:
 *       200:
 *         description: List of the last 20 chat messages for the specified chat room.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the chat message.
 *                     example: "603d214f8e3fcd1f9c4efb96"
 *                   room:
 *                     type: string
 *                     description: The name of the chat room.
 *                     example: "Study Group"
 *                   message:
 *                     type: string
 *                     description: The message content.
 *                     example: "Hello, everyone!"
 *                   sender:
 *                     type: object
 *                     properties:
 *                       profilePic:
 *                         type: string
 *                         description: URL to the sender's profile picture.
 *                         example: "http://example.com/profile.jpg"
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the message was sent.
 *                         example: "2023-10-24T14:48:00.000Z"
 *       400:
 *         description: Chatroom not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
Router.get("/:name", AuthMiddleware, async (req, res) => {
  const chat = await Chatroom.findOne({
    name: req.params.name,
  });
  if (!chat) return res.status(400).send("Chatroom not found");
  const chathistory = await Chat.find({
    room: chat.name,
  })
    .populate({
      path: "sender",
      select: "profilePic date",
    })
    .sort({ date: -1 })
    .limit(20);

  res.send(chathistory);
});

module.exports = Router;
