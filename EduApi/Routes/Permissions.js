const express = require("express");
const { Permission, validatePermission } = require("../Model/Permission");
const Router = express.Router();
const AuthMiddleware = require("../MiddleWare/AuthMiddleware");
const { roleAuth } = require("../MiddleWare/RoleAuth");
const mongoose = require("mongoose");

const { sendPushNotification,sendtoadmin } = require("../utils/sendPushNotification");


Router.post("/", AuthMiddleware, async (req, res) => {
  try {
    const { error } = validatePermission(req.body);
    console.log("error");

    if (error) return res.status(400).send(error.details[0].message);
    const prevPermission = await Permission.findOne({
      user: req.user.userid,
      permissionDate: req.body.permissionDate,
    });
    if (prevPermission)
      return res
        .status(400)
        .send("Permission already created check For Approval in History");
    const permission = new Permission({
      Reason: req.body.Reason,
      user: req.user.userid,
      permissionDate: req.body.permissionDate,
    });
sendtoadmin("new permission has been submitted by a student need to be approved")
    await permission.save();
    return res.send(permission);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});
Router.get(
  "/History",
  AuthMiddleware,

  async (req, res) => {
    try {
      const permissions = await Permission.find({
        user: req.user.userid,
      });
      return res.send(permissions);
    } catch (err) {
      res.status(500).send(err.message || "Something went wrong");
    }
  }
);
Router.get("/new", async (req, res) => {
  try {
    const currentDate = new Date().toISOString(); 
    
    const permissions = await Permission.find().populate("user");

    return res.send(permissions);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});

Router.get("/all", AuthMiddleware, async (req, res) => {
  try {
    const permissions = await Permission.find();
    return res.send(permissions);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});
Router.put("/update/:id", async (req, res) => {
  try {
    const isvalidMongooseId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isvalidMongooseId) return res.status(400).send("Invalid id");

    const permission = await Permission.findById(req.params.id);
    if (!permission) return res.status(400).send("Permission not found");
    permission.status = req.body.status;
    await permission.save();

    const notificationData = {
      notification:
        permission.status === "approved"
          ? `Your Gate permission is approved  for ${permission.permissionDate}`
          : "sorry your permission is denied B/c of some reason",
      user: permission.user,
      type: "Notice",
    };
    console.log("Notification data:", notificationData);

    const { notification, ticket } = await sendPushNotification(
      permission.user,
      notificationData
    );
    return res.send(permission);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message || "Something went wrong");
  }
});




Router.delete("/:id", async (req, res) => {
  try {
    const isvalidMongooseId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isvalidMongooseId) return res.status(400).send("Invalid id");

    const permissions = await Permission.findByIdAndDelete(req.params.id);
    if (!permissions) return res.status(400).send("Permission not found");

    return res.send(permissions);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});

module.exports = Router;
