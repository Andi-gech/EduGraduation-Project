/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - eventname
 *         - eventdescription
 *         - eventStartDate
 *         - eventEndDate
 *       properties:
 *         eventname:
 *           type: string
 *           description: Name of the event
 *         eventdescription:
 *           type: string
 *           description: Description of the event
 *         eventStartDate:
 *           type: string
 *           format: date
 *           description: Start date of the event
 *         eventEndDate:
 *           type: string
 *           format: date
 *           description: End date of the event
 *       example:
 *         eventname: Coding Workshop
 *         eventdescription: Learn advanced coding techniques
 *         eventStartDate: 2024-12-01
 *         eventEndDate: 2024-12-03
 */

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management API
 */

const express = require("express");
const { Event, validateEvent } = require("../Model/Event");
const router = express.Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.send(events);
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error
 */
router.post("/", async (req, res) => {
  const { error } = validateEvent(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let event = new Event({
    name: req.body.eventname,
    eventdescription: req.body.eventdescription,
    StartDate: req.body.eventStartDate,
    EndDate: req.body.eventEndDate,
  });
  event = await event.save();
  res.status(201).send(event);
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an existing event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Event not found
 */
router.put("/:id", async (req, res) => {
  const { error } = validateEvent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!event) return res.status(404).send("Event not found.");

  res.send(event);
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete("/:id", async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).send("Event not found.");

  res.send("Event deleted successfully.");
});

module.exports = router;
