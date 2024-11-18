const express = require("express");
const { User } = require("../Model/User");
const { Cafe } = require("../Model/Cafe");

const Router = express.Router();
/**
 * @swagger
 * /report/activePersonel:
 *   get:
 *     summary: Retrieve active personnel count
 *     description: Returns the count of users in the compound and the total number of users.
 *     tags: [User Statistics]
 *     responses:
 *       200:
 *         description: The number of users in the compound and total user count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userincomponund:
 *                   type: integer
 *                   description: Count of users in the compound.
 *                   example: 15
 *                 count:
 *                   type: integer
 *                   description: Total user count.
 *                   example: 100
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the issue.
 *                   example: "Something went wrong."
 */
Router.get("/activePersonel", async (req, res) => {
  const userincomponund = await User.countDocuments({ incomponund: true });
  const count = await User.countDocuments();

  return res.send({
    userincomponund: userincomponund,
    count: count,
  });
});
/**
 * @swagger
 * /report/activeSubscriptions:
 *   get:
 *     summary: Retrieve active subscriptions count
 *     description: Returns the count of active subscriptions and total user count.
 *     tags: [Subscription Statistics]
 *     responses:
 *       200:
 *         description: The count of active subscriptions and total user count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Count of active subscriptions.
 *                   example: 25
 *                 user:
 *                   type: integer
 *                   description: Total user count.
 *                   example: 100
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the issue.
 *                   example: "Something went wrong."
 */
Router.get("/activeSubscriptions", async (req, res) => {
  const count = await Cafe.countDocuments({
    enddate: { $gt: Date.now() },
  });
  const user = await User.countDocuments();
  return res.send({
    count: count,
    user: user,
  });
});
/**
 * @swagger
 * /report/department:
 *   get:
 *     summary: Get user count by department
 *     description: Returns the number of users grouped by their department. If a department has no users, it will still be included in the response with a count of 0.
 *     responses:
 *       200:
 *         description: A list of departments with the number of users in each.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   department:
 *                     type: string
 *                     description: The name of the department.
 *                   count:
 *                     type: integer
 *                     description: The number of users in the department.
 *       500:
 *         description: Internal Server Error
 */
Router.get("/department", async (req, res) => {
  try {
    // Array of all possible departments
    const allDepartments = [
      "Computer Science",
      "Electronics",
      "Civil",
      "Mechanical",
      "Electrical",
      "Aeronautical",
      "Production",
      "Chemical",
      "Motor Vehicles",
    ];

    const departmentCounts = await User.aggregate([
      {
        $lookup: {
          from: "classes", // The name of the collection for Class model
          localField: "Class", // Field in User that references Class
          foreignField: "_id", // Field in Class that is referenced
          as: "classInfo", // Output array field
        },
      },
      {
        $unwind: {
          path: "$classInfo",
          preserveNullAndEmptyArrays: true, // Preserve users without a class
        },
      },
      {
        $group: {
          _id: "$classInfo.department", // Group by department
          count: { $sum: 1 }, // Count the number of users
        },
      },
      {
        $project: {
          department: "$_id",
          count: 1,
          _id: 0, // Exclude _id from the output
        },
      },
    ]);

    // Prepare final report with zero counts for departments with no users
    const finalReport = allDepartments.map((department) => {
      const found = departmentCounts.find((d) => d.department === department);
      return {
        department,
        count: found ? found.count : 0, // Default to 0 if not found
      };
    });

    res.status(200).json(finalReport);
  } catch (error) {
    console.error("Error fetching department report:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = Router;
