const express = require("express");
const { Complain, validateComplain } = require("../Model/Complain");
const mongoose = require("mongoose");
const Router = express.Router();
const Authetication = require("../MiddleWare/AuthMiddleware");
const { roleAuth } = require("../MiddleWare/RoleAuth");
const sendPushNotification = require("../utils/sendPushNotification");
/**
 * @swagger
 * /complain:
 *   post:
 *     summary: Submit a new complaint
 *     description: Allows a student to submit a complaint with a specified type.
 *     tags: [Complain]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complain:
 *                 type: string
 *                 description: The content of the complaint.
 *                 example: "Noise levels in the library are too high."
 *               type:
 *                 type: string
 *                 description: The type/category of the complaint.
 *                 example: "Facility"
 *     responses:
 *       200:
 *         description: Complaint submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the submitted complaint.
 *                   example: "609d214f8e3fcd1f9c4efb96"
 *                 complain:
 *                   type: string
 *                   description: The submitted complaint content.
 *                   example: "Noise levels in the library are too high."
 *                 type:
 *                   type: string
 *                   description: Type of the complaint.
 *                   example: "Facility"
 *                 user:
 *                   type: string
 *                   description: User ID of the student who submitted the complaint.
 *                   example: "608e220f5fbc120f8a4e2b96"
 *       400:
 *         description: Validation error in the request body
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User does not have permission to submit a complaint
 *       500:
 *         description: Internal server error
 */
Router.post("/", Authetication, async (req, res) => {
  try {
    const { error } = validateComplain(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const complain = new Complain({
      complain: req.body.complain,
      type: req.body.type,
      user: req.user.userid,
    });
    await complain.save();
    const notificationData = {
      notification:
        "We are Sorry for the inconvenience, we will get back to you soon",
      user: req.user.userid,
      type: "Notice",
    };
    console.log("Notification data:", notificationData);

    const { notification, ticket } = await sendPushNotification(
      req.user.userid,
      notificationData
    );
    return res.send(complain);
  } catch (error) {
    return res.status(500).send(error.message || "Something went wrong");
  }
});
/**
 * @swagger
 * /complain/:
 *   get:
 *     summary: Retrieve all complaints
 *     description: Returns a list of all complaints with user details (first and last name).
 *     tags: [Complain]
 *     responses:
 *       200:
 *         description: List of complaints retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the complaint.
 *                     example: "609d214f8e3fcd1f9c4efb96"
 *                   complain:
 *                     type: string
 *                     description: Content of the complaint.
 *                     example: "Noise levels in the library are too high."
 *                   type:
 *                     type: string
 *                     description: Category/type of the complaint.
 *                     example: "Facility"
 *                   user:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID of the student who submitted the complaint.
 *                         example: "608e220f5fbc120f8a4e2b96"
 *                       firstName:
 *                         type: string
 *                         description: First name of the user.
 *                         example: "John"
 *                       lastName:
 *                         type: string
 *                         description: Last name of the user.
 *                         example: "Doe"
 *       500:
 *         description: Internal server error
 */

Router.get("/", async (req, res) => {
  try {
    const complain = await Complain.find().populate(
      "user",
      "firstName lastName"
    );
    return res.send(complain);
  } catch (error) {
    return res.status(500).send;
  }
});

/**
 * @swagger
 * /complain/{id}:
 *   put:
 *     summary: Update the status of a specific complaint
 *     description: Updates the status of a complaint by its ID. Status can be updated to values such as "pending," "completed," or "rejected."
 *     tags:
 *       - Complain
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the complaint to update
 *         schema:
 *           type: string
 *     requestBody:    # Use requestBody instead of parameters for the body content
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: The updated complaint
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the complaint
 *                 status:
 *                   type: string
 *                   description: The updated status of the complaint
 *                 complain:
 *                   type: string
 *                   description: The complaint description
 *                 type:
 *                   type: string
 *                   description: The type of complaint
 *                 user:
 *                   type: string
 *                   description: The ID of the user who filed the complaint
 *       400:
 *         description: Status is required or invalid input
 *       404:
 *         description: Complaint not found
 *       500:
 *         description: Server error
 */

Router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).send("Status is required");

    const updatedComplain = await Complain.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedComplain) {
      return res.status(404).send("Complaint not found");
    }

    return res.send(updatedComplain);
  } catch (error) {
    console.error("Error updating complaint:", error); // Use console.error for better visibility
    return res.status(500).send(error.message || "Something went wrong");
  }
});

/**
 * @swagger
 * /complain/{id}:
 *   delete:
 *     summary: Delete a specific complaint
 *     description: Deletes a complaint by its ID.
 *     tags: [Complain]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the complaint to delete
 *     responses:
 *       200:
 *         description: Complaint deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the deleted complaint.
 *                   example: "609d214f8e3fcd1f9c4efb96"
 *                 complain:
 *                   type: string
 *                   description: The complaint text that was deleted.
 *                   example: "Noise levels in the library are too high."
 *                 type:
 *                   type: string
 *                   description: Type of the complaint.
 *                   example: "Facility"
 *                 user:
 *                   type: string
 *                   description: ID of the user who submitted the complaint.
 *                   example: "608e220f5fbc120f8a4e2b96"
 *       400:
 *         description: Complaint not found.
 *       500:
 *         description: Internal server error.
 */
Router.delete("/:id", async (req, res) => {
  try {
    const complain = await Complain.findByIdAndDelete(req.params.id);
    if (!complain) return res.status(400).send("Complain not found");
    return res.send(complain);
  } catch (error) {
    return res.status(500).send(error.message || "Something went wrong");
  }
});

module.exports = Router;
