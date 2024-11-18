const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
const { User } = require("../Model/User");
const AuthMiddleware = require("../MiddleWare/AuthMiddleware");

const { roleAuth } = require("../MiddleWare/RoleAuth");
/**
 * @swagger
 * /scanIn/{id}:
 *   put:
 *     summary: Mark a user as scanned in
 *     description: This endpoint allows a ward controller to mark a user as scanned in using their unique ID.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the user to be marked as scanned in.
 *         schema:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"  # Example of a valid MongoDB ObjectID
 *     responses:
 *       200:
 *         description: Successfully marked the user as scanned in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the user.
 *                 incomponund:
 *                   type: boolean
 *                   description: Indicates whether the user is scanned in.
 *                 auth:
 *                   type: string
 *                   description: The authentication ID of the user.
 *       400:
 *         description: Invalid user ID or user not found.
 *       500:
 *         description: Internal server error.
 */
Router.put(
  "/scanIn/:id",
  AuthMiddleware,
  roleAuth("WardControll"),
  async (req, res) => {
    try {
      const isvalidMongooseId = mongoose.Types.ObjectId.isValid(req.params.id);
      if (!isvalidMongooseId) return res.status(400).send("Invalid id");
      const user = await User.findOne({ auth: req.params.id });

      if (!user) return res.status(400).send("User not found");
      user.incomponund = true;
      await user.save();
      return res.send(user);
    } catch (error) {
      return res.status(500).send(error.message || "Something went wrong");
    }
  }
);
/**
 * @swagger
 * /scanOut/{id}:
 *   put:
 *     summary: Mark a user as scanned out
 *     description: This endpoint allows a ward controller to mark a user as scanned out using their unique ID.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the user to be marked as scanned out.
 *         schema:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"  # Example of a valid MongoDB ObjectID
 *     responses:
 *       200:
 *         description: Successfully marked the user as scanned out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the user.
 *                 incomponund:
 *                   type: boolean
 *                   description: Indicates whether the user is scanned out.
 *                 auth:
 *                   type: string
 *                   description: The authentication ID of the user.
 *       400:
 *         description: Invalid user ID or user not found.
 *       500:
 *         description: Internal server error.
 */
Router.put(
  "/scanOut/:id",
  AuthMiddleware,
  roleAuth("WardControll"),
  async (req, res) => {
    try {
      const isvalidMongooseId = mongoose.Types.ObjectId.isValid(req.params.id);
      if (!isvalidMongooseId) return res.status(400).send("Invalid id");
      const user = await User.findOne({ auth: req.params.id });

      if (!user) return res.status(400).send("User not found");
      user.incomponund = false;
      await user.save();
      return res.send(user);
    } catch (error) {
      return res.status(500).send(error.message || "Something went wrong");
    }
  }
);

module.exports = Router;
