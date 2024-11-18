const express = require("express");
const { User } = require("../Model/User");
const { Class } = require("../Model/Class");
const mongoose = require("mongoose");

const Router = express.Router();
const Years = ["1", "2", "3", "4", "5", "Graduated"];

/**
 * @swagger
 * /promotion/promote:
 *   post:
 *     summary: Promote students to the next academic year or semester
 *     description: This endpoint promotes students by updating their semester and year level. If a student's semester is 2, their year level is incremented. If the semester is 1, it is incremented to 2. Requires appropriate permissions.
 *     tags: [Promotion]
 *     responses:
 *       200:
 *         description: Users promoted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Users promoted successfully."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
Router.post("/promote", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const classToUpdate = await Class.find().session(session);

    const updatedClasses = classToUpdate.map((classroom) => {
      if (classroom.yearLevel === "Graduated") {
        // Skip if student has already graduated
        return classroom;
      }

      if (classroom.semister === "2") {
        // If the student has completed semester 2, promote their year level
        const nextYearIndex = Years.indexOf(classroom.yearLevel) + 1;
        if (nextYearIndex < Years.length) {
          classroom.yearLevel = Years[nextYearIndex];
          classroom.semister = classroom.yearLevel === "Graduated" ? null : "1"; // Reset semester or clear for graduates
        }
      } else if (classroom.semister === "1") {
        // Move from semester 1 to semester 2 within the same year level
        classroom.semister = "2";
      }
      return classroom;
    });

    await Class.bulkWrite(
      updatedClasses.map((classroom) => ({
        updateOne: {
          filter: { _id: classroom._id },
          update: {
            $set: {
              yearLevel: classroom.yearLevel,
              semister: classroom.semister,
            },
          },
        },
      })),
      { session }
    );

    await session.commitTransaction();
    res.status(200).json({ message: "Users promoted successfully." });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error promoting users:", error);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    session.endSession();
  }
});

module.exports = Router;
