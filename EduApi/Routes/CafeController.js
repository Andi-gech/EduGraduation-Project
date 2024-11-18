const express = require("express");
const { Cafe, validateCafe } = require("../Model/Cafe");
const { User } = require("../Model/User");
const Router = express.Router();
const Authetication = require("../MiddleWare/AuthMiddleware");
const { roleAuth } = require("../MiddleWare/RoleAuth");
const { CafeGate } = require("../Model/CafeGate");
const { Auth, validateAuth } = require("../Model/Auth");
const { signData, verifyData } = require("../utils/Signiture");
const { encrypt, decrypt } = require("../utils/Crypto");
/**
 * @swagger
 * /cafe/subscribe:
 *   post:
 *     summary: Subscribe to a cafe
 *     description: Allows a user to subscribe to a cafe service.
 *     tags: [Cafe]
 *     security:
 *       - tokenAuth: []  # Specify the authentication type used in your application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *                 description: The location of the cafe to subscribe to.
 *                 example: "123 Main St, Anytown, USA"
 *     responses:
 *       201:
 *         description: Subscription successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier for the cafe subscription.
 *                   example: "60d5ec49e4b0f2b5b473c0c2"
 *                 location:
 *                   type: string
 *                   description: The location of the cafe.
 *                   example: "123 Main St, Anytown, USA"
 *                 user:
 *                   type: string
 *                   description: The user ID of the subscriber.
 *                   example: "60d5ec49e4b0f2b5b473c0c1"
 *       400:
 *         description: Bad request or already subscribed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the issue.
 *                   example: "Already Subscribed"
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
 *                   example: "Internal server error"
 */
Router.post(
  "/subscribe",
  Authetication,

  async (req, res) => {
    const { error } = validateCafe(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const subs = await Cafe.findOne({
      user: req.user.userid,
      enddate: { $gt: Date.now() },
    });
    if (subs) return res.status(400).send("Already Subscribed");
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    // if (currentDay > 29)
    //   return res.status(400).send("Month Subscription not available");
    const cafe = new Cafe({
      location: req.body.location,
      user: req.user.userid,
    });
    await cafe.save();
    return res.send(cafe);
  }
);
/**
 * @swagger
 * /cafe/unsubscribe/{id}:
 *   delete:
 *     summary: Unsubscribe from a cafe
 *     description: Allows a user to unsubscribe from a cafe service by its ID.
 *     tags: [Cafe]
 *     security:
 *       - tokenAuth: []  # Specify the authentication type used in your application
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the cafe subscription to unsubscribe from.
 *         schema:
 *           type: string
 *           example: "60d5ec49e4b0f2b5b473c0c2"
 *     responses:
 *       200:
 *         description: Unsubscription successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier for the cafe subscription that was deleted.
 *                   example: "60d5ec49e4b0f2b5b473c0c2"
 *                 location:
 *                   type: string
 *                   description: The location of the cafe that was unsubscribed from.
 *                   example: "123 Main St, Anytown, USA"
 *                 user:
 *                   type: string
 *                   description: The user ID of the subscriber.
 *                   example: "60d5ec49e4b0f2b5b473c0c1"
 *       400:
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the subscription does not exist.
 *                   example: "Subscription not found"
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
 *                   example: "Something went wrong"
 */
Router.delete("/unsubscribe/:id", async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndDelete(req.params.id);
    if (!cafe) return res.status(400).send("Subscription not found");
    return res.send(cafe);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});
/**
 * @swagger
 * /cafe/subscription/status:
 *   get:
 *     summary: Check subscription status
 *     description: Retrieves the current subscription status for the authenticated user.
 *     tags: [Cafe]
 *     security:
 *       - tokenAuth: []  # Specify the authentication type used in your application
 *     responses:
 *       200:
 *         description: Successful retrieval of subscription status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates if the user has an active subscription.
 *                   example: true
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
 *                   example: "Something went wrong"
 */
Router.get("/subscription/status", Authetication, async (req, res) => {
  try {
    const cafe = await Cafe.findOne({
      user: req.user.userid,
      enddate: { $gt: Date.now() },
    });
    if (!cafe)
      return res.send({
        status: false,
      });

    return res.send({
      status: true,
    });
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});
/**
 * @swagger
 * /subscriptions:
 *   get:
 *     summary: Retrieve subscriptions for a specific month and year
 *     description: Fetches all subscriptions for the authenticated user within the specified month and year.
 *     tags: [Cafe]
 *     security:
 *       - tokenAuth: []  # Specify the authentication type used in your application
 *     parameters:
 *       - name: month
 *         in: query
 *         required: true
 *         description: The month to filter subscriptions (1-12).
 *         schema:
 *           type: integer
 *           example: 10  # October
 *       - name: year
 *         in: query
 *         required: true
 *         description: The year to filter subscriptions.
 *         schema:
 *           type: integer
 *           example: 2024
 *     responses:
 *       200:
 *         description: Successful retrieval of subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the subscription.
 *                     example: "60c72b2f9f1b2c001cb4e5a3"
 *                   location:
 *                     type: string
 *                     description: The location associated with the subscription.
 *                     example: "Café Mocha"
 *                   startdate:
 *                     type: string
 *                     format: date-time
 *                     description: The start date of the subscription.
 *                     example: "2024-10-01T00:00:00.000Z"
 *                   enddate:
 *                     type: string
 *                     format: date-time
 *                     description: The end date of the subscription.
 *                     example: "2024-10-31T23:59:59.999Z"
 *       400:
 *         description: Bad request due to missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining the bad request.
 *                   example: "Month and year parameters are required."
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
 *                   example: "Something went wrong"
 */
Router.get("/subscriptions", Authetication, async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).send("Month and year parameters are required.");
    }

    const parsedMonth = parseInt(month);
    const parsedYear = parseInt(year);

    if (isNaN(parsedMonth) || isNaN(parsedYear)) {
      return res.status(400).send("Invalid month or year format.");
    }

    if (parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).send("Month must be between 1 and 12.");
    }

    const startDate = new Date(parsedYear, parsedMonth - 1, 1);
    const endDate = new Date(parsedYear, parsedMonth, 0);
    const cafes = await Cafe.find({
      startdate: { $gte: startDate, $lte: endDate },
    });
    return res.send(cafes);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});
/**
 * @swagger
 * /cafe/subscriptions/report:
 *   get:
 *     summary: Retrieve a report of all subscriptions
 *     description: Fetches all subscriptions along with user details for reporting purposes.
 *     tags: [Cafe]
 *     responses:
 *       200:
 *         description: Successful retrieval of subscriptions report
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the subscription.
 *                     example: "60c72b2f9f1b2c001cb4e5a3"
 *                   location:
 *                     type: string
 *                     description: The location associated with the subscription.
 *                     example: "Café Mocha"
 *                   user:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier for the user.
 *                         example: "60c72b2f9f1b2c001cb4e5a4"
 *                       name:
 *                         type: string
 *                         description: The name of the user.
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         description: The email of the user.
 *                         example: "john.doe@example.com"
 *                   startdate:
 *                     type: string
 *                     format: date-time
 *                     description: The start date of the subscription.
 *                     example: "2024-10-01T00:00:00.000Z"
 *                   enddate:
 *                     type: string
 *                     format: date-time
 *                     description: The end date of the subscription.
 *                     example: "2024-10-31T23:59:59.999Z"
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
 *                   example: "Something went wrong"
 */
Router.get("/subscriptions/report", async (req, res) => {
  try {
    const cafes = await Cafe.find().populate("user");
    return res.send(cafes);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});
/**
 * @swagger
 * /cafe/subscribe/manual:
 *   post:
 *     summary: Manually subscribe users to a cafe[ADMIN PREVELAGE]
 *     description: Allows manual subscription of one or more users to a cafe location. Transactions are used to ensure data integrity.
 *     tags: [Cafe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *                 description: The location of the cafe.
 *                 example: "Café Mocha"
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The unique identifier of the user(s) to subscribe.
 *                   example: "60c72b2f9f1b2c001cb4e5a4"
 *     responses:
 *       200:
 *         description: Successful subscription of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the subscription.
 *                     example: "60c72b2f9f1b2c001cb4e5a3"
 *                   location:
 *                     type: string
 *                     description: The location associated with the subscription.
 *                     example: "Café Mocha"
 *                   user:
 *                     type: string
 *                     description: The unique identifier of the user.
 *                     example: "60c72b2f9f1b2c001cb4e5a4"
 *                   startdate:
 *                     type: string
 *                     format: date-time
 *                     description: The start date of the subscription.
 *                     example: "2024-10-01T00:00:00.000Z"
 *                   enddate:
 *                     type: string
 *                     format: date-time
 *                     description: The end date of the subscription.
 *                     example: "2024-10-31T23:59:59.999Z"
 *       400:
 *         description: Bad request if user is already subscribed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining why the request failed.
 *                   example: "User 60c72b2f9f1b2c001cb4e5a4 is already subscribed"
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
 *                   example: "Subscription failed: [error message]"
 */
Router.post("/subscribe/manual", async (req, res) => {
  const session = await Cafe.startSession(); // Start a session for transaction
  session.startTransaction(); // Begin transaction

  try {
    let usersToSubscribe = [];

    if (Array.isArray(req.body.users)) {
      usersToSubscribe = req.body.users;
    } else {
      usersToSubscribe.push(req.body.users);
    }

    const subscriptions = [];

    for (let userId of usersToSubscribe) {
      // Check if the user is already subscribed
      const subs = await Cafe.findOne({
        user: userId,
        enddate: { $gt: Date.now() },
      }).session(session); // Add session to ensure transaction scope

      if (subs) {
        // Abort transaction if any user is already subscribed
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .send("User " + userId + " is already subscribed");
      }

      // Create a new subscription if not already subscribed
      const cafe = new Cafe({
        location: req.body.location,
        user: userId,
      });

      await cafe.save({ session }); // Save within transaction
      subscriptions.push(cafe);
    }

    // Commit the transaction after successful operations
    await session.commitTransaction();
    session.endSession();

    return res.send(subscriptions);
  } catch (err) {
    // Abort the transaction and return error in case of any issue
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send("Subscription failed: " + err.message);
  }
});

const mealTimes = {
  breakfast: { start: 6, end: 10 }, // Breakfast time range (6:00 AM - 10:00 AM)
  lunch: { start: 12, end: 14 }, // Lunch time range (12:00 PM - 2:00 PM)
  dinner: { start: 18, end: 20 }, // Dinner time range (6:00 PM - 8:00 PM)
};

// Function to get current meal based on time
const getCurrentMeal = () => {
  const currentHour = new Date().getHours();

  if (
    currentHour >= mealTimes.breakfast.start &&
    currentHour < mealTimes.breakfast.end
  ) {
    return "BreakFast";
  } else if (
    currentHour >= mealTimes.lunch.start &&
    currentHour < mealTimes.lunch.end
  ) {
    return "Lunch";
  } else if (
    currentHour >= mealTimes.dinner.start &&
    currentHour < mealTimes.dinner.end
  ) {
    return "Dinner";
  }
  return null; // No meal available for check-in outside of these times
};
/**
 * @swagger
 * /cafe/check/meal:
 *   put:
 *     summary: Check-in for a meal
 *     description: Allows a student to check-in for a meal using a QR code.
 *     tags: [Meal Check-In]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               qrurl:
 *                 type: string
 *                 description: The QR code URL containing encrypted data and signature.
 *                 example: "encryptedData:signature"
 *     responses:
 *       200:
 *         description: Meal check-in successful
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Breakfast checked for today."
 *       400:
 *         description: Bad request or meal already checked
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Breakfast has already been checked for today."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Something went wrong."
 */

Router.put("/check/meal/", async (req, res) => {
  try {
    const qrurl = req.body.qrurl;
    if (!qrurl) {
      return res.status(400).send("QR URL is required.");
    }

    // Extract encrypted data and signature from QR code
    const data = qrurl.split(":");
    if (data.length !== 3) {
      return res.status(400).send("Invalid QR format.");
    }

    const encrypted = `${data[0]}:${data[1]}`;
    const signed = data[2];

    // Decrypt the encrypted data to get the student ID
    const studentid = decrypt(encrypted);
    if (!studentid) {
      return res.status(400).send("Decryption failed.");
    }

    // Verify the signature to ensure data integrity
    const verified = verifyData(encrypted, signed);
    if (!verified) {
      return res.status(400).send("Invalid QR code signature.");
    }

    // Find the student based on the decrypted ID
    const student = await User.findOne({
      auth: studentid,
    });
    if (!student) {
      return res.status(400).send("Student not found.");
    }

    // Determine the current meal time (breakfast, lunch, dinner)
    const currentMeal = getCurrentMeal();
    if (!currentMeal) {
      return res
        .status(400)
        .send("It's not time for breakfast, lunch, or dinner.");
    }

    // Check if the student has already checked in for the current meal today
    const existingCafe = await CafeGate.findOne({
      user: studentid,
      Date: {
        $gte: new Date(new Date().setHours(0, 0, 0)), // Start of the day
        $lt: new Date(new Date().setHours(23, 59, 59)), // End of the day
      },
    });

    // If the student has already checked in for the current meal, return an error
    if (existingCafe && existingCafe[currentMeal] === true) {
      return res
        .status(400)
        .send(`${currentMeal} has already been checked for today.`);
    }

    // Update or create the student's meal check-in for the current day
    const cafe = await CafeGate.findOneAndUpdate(
      {
        user: studentid,
        Date: {
          $gte: new Date(new Date().setHours(0, 0, 0)), // Start of the day
          $lt: new Date(new Date().setHours(23, 59, 59)), // End of the day
        },
      },
      {
        $set: {
          [currentMeal]: true,
        },
      },
      { new: true, upsert: true } // Create if doesn't exist
    );

    // Return the updated or created meal check-in
    return res.send(`${currentMeal} checked for today.`);
  } catch (err) {
    // Handle any unexpected errors
    return res.status(500).send(err.message || "Something went wrong.");
  }
});

/**
 * @swagger
 * cafe/report:
 *   get:
 *     summary: Retrieve meal check-in report
 *     description: Fetches a report of all meal check-ins, including user details, from the database.
 *     tags: [Meal Check-In Report]
 *     responses:
 *       200:
 *         description: A list of meal check-ins with user details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the meal check-in record.
 *                     example: "60b8c7f1f3f6f35c3d6e5c2e"
 *                   user:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier for the user.
 *                         example: "60b8c7f1f3f6f35c3d6e5c2f"
 *                       name:
 *                         type: string
 *                         description: The name of the user.
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         description: The email of the user.
 *                         example: "johndoe@example.com"
 *                   Date:
 *                     type: string
 *                     format: date-time
 *                     description: The date of the meal check-in.
 *                     example: "2024-10-25T12:00:00Z"
 *                   breakfast:
 *                     type: boolean
 *                     description: Indicates if the user checked in for breakfast.
 *                     example: true
 *                   lunch:
 *                     type: boolean
 *                     description: Indicates if the user checked in for lunch.
 *                     example: false
 *                   dinner:
 *                     type: boolean
 *                     description: Indicates if the user checked in for dinner.
 *                     example: false
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
Router.get("/report", async (req, res) => {
  const cafe = await CafeGate.find().populate("user");
  return res.send(cafe);
});

module.exports = Router;
