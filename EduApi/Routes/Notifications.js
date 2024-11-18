const express = require("express");
const { Notifications } = require("../Model/Notifications");
const Router = express.Router();
const Authetication = require("../MiddleWare/AuthMiddleware");
const { roleAuth } = require("../MiddleWare/RoleAuth");
const { User } = require("../Model/User");
const { Expo } = require("expo-server-sdk");
const sendPushNotification = require("../utils/sendPushNotification");
/**
 * @swagger
 * /notification/:
 *   get:
 *     summary: Retrieve notifications for a student
 *     description: Fetches notifications for the authenticated student user.
 *     tags: [Notifications]
 *     security:
 *       - tokenAuth: []  # Assuming you're using bearer token authentication
 *     responses:
 *       200:
 *         description: A list of notifications for the student.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier for the notification.
 *                   message:
 *                     type: string
 *                     description: The notification message.
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the notification was created.
 *       404:
 *         description: No notifications found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No notifications found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong."
 */

Router.get("/", Authetication, async (req, res) => {
  try {
    const notifications = await Notifications.find({
      user: req.user.userid,
    });
    res.send(notifications);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});

/**
 * @swagger
 * /notification/:
 *   post:
 *     summary: Create a notification and send a push notification to the user.
 *     description: This endpoint saves a notification to the database and sends a push notification to the specified user using their Expo push token.
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The ID of the user to whom the notification will be sent.
 *               notification:
 *                 type: string
 *                 description: The message content of the notification.
 *               type:
 *                 type: string
 *                 description: The type of notification being sent.
 *             required:
 *               - user
 *               - notification
 *               - type
 *     responses:
 *       200:
 *         description: Notification created and push notification sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the saved notification.
 *                 notification:
 *                   type: string
 *                   description: The message content of the notification.
 *                 user:
 *                   type: string
 *                   description: The ID of the user.
 *                 type:
 *                   type: string
 *                   description: The type of notification.
 *       400:
 *         description: Invalid request parameters or push token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Description of the error.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Description of the error.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Description of the error.
 */
Router.post("/", async (req, res) => {
  try {
    const { error } = Notifications.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const notificationData = {
      notification: req.body.notification,
      user: req.body.user,
      type: req.body.type,
    };

    const { notification, ticket } = await sendPushNotification(
      req.body.user,
      notificationData
    );

    // Optionally handle ticket receipts here if needed

    res.status(201).send(notification); // Send back the saved notification response
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).send(err.message || "Something went wrong");
  }
});

module.exports = Router;
