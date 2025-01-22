const express = require("express");
const { Notifications } = require("../Model/Notifications");
const Router = express.Router();
const Authetication = require("../MiddleWare/AuthMiddleware");

const {
  sendPushNotification,
  sendPushNotificationToAll,
} = require("../utils/sendPushNotification");


Router.get("/all", async (req, res) => {
  try {
    const notifications = await Notifications.find({
      user: null,

    });
    res.send(notifications);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});
Router.get("/", Authetication, async (req, res) => {
  try {
    const notifications = await Notifications.find({
      $or: [
        { user: req.user.userid },
        { user: null },            
      ],
      isForAdmin: false,
    });
    res.send(notifications);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});


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

Router.post("/all", async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.notification === undefined) {
      return res.status(400).send("Notification field is required");
    }
    const notificationData = req.body.notification;
    const tickets = await sendPushNotificationToAll(notificationData);
    res.status(201).send(tickets);
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).send(err.message || "Something went wrong");
  }
});
Router.delete("/:id", async (req, res) => {
  try {
    const notification = await Notifications.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).send("Notification not found");
    res.send(notification);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});

module.exports = Router;
