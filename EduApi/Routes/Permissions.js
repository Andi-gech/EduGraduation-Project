const express = require("express");
const { Permission, validatePermission } = require("../Model/Permission");
// const {User}=require("../Model/User")
const Router = express.Router();
const AuthMiddleware = require("../MiddleWare/AuthMiddleware");
const Authetication = require("../MiddleWare/AuthMiddleware");
const { roleAuth } = require("../MiddleWare/RoleAuth");
const mongoose = require("mongoose");
const { getIo } = require("./Chat");
const { Notifications } = require("../Model/Notifications");

/**
 * @swagger
 * /permissions/:
 *   post:
 *     summary: Create a new permission request
 *     description: This endpoint allows a student to create a new permission request. If a permission request already exists for the given date, an error message will be returned.
 *     tags: [Permissions]
 *     security:
 *       - tokenAuth: []  # Assuming you're using Bearer token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Reason:
 *                 type: string
 *                 example: "I need permission to attend a family event."
 *               permissionDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-11-15"
 *     responses:
 *       200:
 *         description: Permission request created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f9b1e8c001f8d4b58"
 *                 Reason:
 *                   type: string
 *                   example: "I need permission to attend a family event."
 *                 user:
 *                   type: string
 *                   example: "60c72b2f9b1e8c001f8d4b57"
 *                 permissionDate:
 *                   type: string
 *                   format: date
 *                   example: "2023-11-15"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-25T12:00:00.000Z"
 *       400:
 *         description: Invalid request, permission already exists, or validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Permission already created check For Approval in History"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */
Router.post("/", AuthMiddleware, async (req, res) => {
  try {
    const { error } = validatePermission(req.body);
    console.log("error");

    if (error) return res.status(400).send(error.details[0].message);
    const prevPermission = await Permission.findOne({
      user: req.user._id,
      permissionDate: req.body.permissionDate,
    });
    if (prevPermission)
      return res
        .status(400)
        .send("Permission already created check For Approval in History");
    const permission = new Permission({
      Reason: req.body.Reason,
      user: req.user._id,
      permissionDate: req.body.permissionDate,
    });

    await permission.save();
    return res.send(permission);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});
/**
 * @swagger
 * /History:
 *   get:
 *     summary: Retrieve permission history for a student
 *     description: This endpoint allows a student to retrieve their permission request history. It returns all permission requests associated with the authenticated user.
 *     tags: [Permissions]
 *     security:
 *       - tokenAuth: []  # Assuming you're using Bearer token for authentication
 *     responses:
 *       200:
 *         description: Successful retrieval of permission history.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f9b1e8c001f8d4b58"
 *                   Reason:
 *                     type: string
 *                     example: "I need permission to attend a family event."
 *                   user:
 *                     type: string
 *                     example: "60c72b2f9b1e8c001f8d4b57"
 *                   permissionDate:
 *                     type: string
 *                     format: date
 *                     example: "2023-11-15"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-10-25T12:00:00.000Z"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */
Router.get(
  "/History",
  AuthMiddleware,
  roleAuth("student"),
  async (req, res) => {
    try {
      const permissions = await Permission.find({
        user: req.user._id,
      });
      return res.send(permissions);
    } catch (err) {
      res.status(500).send(err.message || "Something went wrong");
    }
  }
);
/**
 * @swagger
 * /new:
 *   get:
 *     summary: Retrieve pending permissions for the next 24 hours
 *     description: This endpoint allows authenticated users to retrieve permissions that have a status of "pending" and are scheduled to occur within the next 24 hours.
 *     tags: [Permissions]
 *     security:
 *       - tokenAuth: []  # Assuming you're using Bearer token for authentication
 *     responses:
 *       200:
 *         description: Successful retrieval of pending permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f9b1e8c001f8d4b58"
 *                   Reason:
 *                     type: string
 *                     example: "Requesting permission to attend an event."
 *                   user:
 *                     type: string
 *                     example: "60c72b2f9b1e8c001f8d4b57"
 *                   permissionDate:
 *                     type: string
 *                     format: date
 *                     example: "2023-10-26"
 *                   status:
 *                     type: string
 *                     example: "pending"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-10-25T12:00:00.000Z"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */
Router.get("/new", AuthMiddleware, async (req, res) => {
  try {
    const permissions = await Permission.find({
      permissionDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      status: "pending",
    });
    return res.send(permissions);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});
/**
 * @swagger
 * /all:
 *   get:
 *     summary: Retrieve all permissions
 *     description: This endpoint allows authenticated users to retrieve a list of all permission requests.
 *     tags: [Permissions]
 *     security:
 *       - tokenAuth: []  # Assuming you're using Bearer token for authentication
 *     responses:
 *       200:
 *         description: Successful retrieval of all permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f9b1e8c001f8d4b58"
 *                   Reason:
 *                     type: string
 *                     example: "Requesting permission to attend an event."
 *                   user:
 *                     type: string
 *                     example: "60c72b2f9b1e8c001f8d4b57"
 *                   permissionDate:
 *                     type: string
 *                     format: date
 *                     example: "2023-10-26"
 *                   status:
 *                     type: string
 *                     example: "approved"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-10-25T12:00:00.000Z"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */
Router.get("/all", AuthMiddleware, async (req, res) => {
  try {
    const permissions = await Permission.find();
    return res.send(permissions);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});
/**
 * @swagger
 * /approve/{id}:
 *   put:
 *     summary: Approve a permission request
 *     description: This endpoint allows authenticated users to approve a permission request by its ID. A notification is sent to the user upon approval.
 *     tags: [Permissions]
 *     security:
 *       - tokenAuth: []  # Assuming you're using Bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the permission request to approve.
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1e8c001f8d4b58"
 *     responses:
 *       200:
 *         description: Permission approved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f9b1e8c001f8d4b58"
 *                 Reason:
 *                   type: string
 *                   example: "Requesting permission to attend an event."
 *                 user:
 *                   type: string
 *                   example: "60c72b2f9b1e8c001f8d4b57"
 *                 permissionDate:
 *                   type: string
 *                   format: date
 *                   example: "2023-10-26"
 *                 status:
 *                   type: string
 *                   example: "approved"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-25T12:00:00.000Z"
 *       400:
 *         description: Invalid ID or permission not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   enum:
 *                     - "Invalid id"
 *                     - "Permission not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */

Router.put("/approve/:id", AuthMiddleware, async (req, res) => {
  try {
    const { io, userSocketMap } = getIo();
    const isvalidMongooseId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isvalidMongooseId) return res.status(400).send("Invalid id");

    const permission = await Permission.findById(req.params.id);
    if (!permission) return res.status(400).send("Permission not found");
    permission.status = "approved";
    await permission.save();
    const notification = new Notifications({
      user: permission.user,
      notification: permission.status
        ? `${permission.permissionDate} permission approved`
        : `${permission.permissionDate} permission denied`,
    });
    await notification.save();

    const socketId = userSocketMap.get(permission.user.toString());

    io.to(socketId).emit("notification", notification);
    return res.send(permission);
  } catch (err) {
    return res.status(500).send(err.message || "Something went wrong");
  }
});
/**
 * @swagger
 * /reject/{id}:
 *   put:
 *     summary: Reject a permission request
 *     description: This endpoint allows authenticated users with the "StudentOfficer" role to reject a permission request by its ID.
 *     tags: [Permissions]
 *     security:
 *       - tokenAuth: []  # Assuming you're using Bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the permission request to reject.
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1e8c001f8d4b58"
 *     responses:
 *       200:
 *         description: Permission rejected successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f9b1e8c001f8d4b58"
 *                 Reason:
 *                   type: string
 *                   example: "Requesting permission to attend an event."
 *                 user:
 *                   type: string
 *                   example: "60c72b2f9b1e8c001f8d4b57"
 *                 permissionDate:
 *                   type: string
 *                   format: date
 *                   example: "2023-10-26"
 *                 status:
 *                   type: string
 *                   example: "denied"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-25T12:00:00.000Z"
 *       400:
 *         description: Invalid ID or permission not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   enum:                 # Use enum to specify multiple possible values
 *                     - "Invalid id"
 *                     - "Permission not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */

Router.put(
  "/reject/:id",
  AuthMiddleware,
  roleAuth("StudentOfficer"),
  async (req, res) => {
    try {
      const isvalidMongooseId = mongoose.Types.ObjectId.isValid(req.params.id);
      if (!isvalidMongooseId) return res.status(400).send("Invalid id");

      const permissions = await Permission.findById(req.params.id);
      if (!permissions) return res.status(400).send("Permission not found");
      permissions.status = "denied";
      await permissions.save();

      return res.send(permissions);
    } catch (err) {
      res.status(500).send(err.message || "Something went wrong");
    }
  }
);

module.exports = Router;
