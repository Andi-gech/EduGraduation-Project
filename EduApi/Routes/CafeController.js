const express = require("express");
const { Cafe } = require("../Model/Cafe");
const { User } = require("../Model/User");
const Router = express.Router();
const AuthMiddleware = require("../MiddleWare/AuthMiddleware");
const { CafeGate } = require("../Model/CafeGate");
const {verifyDigitalId}=require("../utils/VerifyDigitalId")
const { MealTimes } = require("../Model/MealTimes");
const Chapa = require("chapa");
const { getCurrentTimeOfDay }=require("../utils/TimeUtils");

let myChapa = new Chapa("CHASECK_TEST-gFVzUEvX8t2gMphMHXxf4v75KOnyHIPE");




Router.put("/check/meal/", async (req, res) => {
  try {
    const { qrurl } = req.body;
    if (!qrurl) return res.status(400).send("QR URL is required.");

   let studentid;
    try {
      studentid = verifyDigitalId(qrurl);
    } catch (error) {
      return res.status(400).send(error.message);
    }

    const student = await User.findOne({ auth: studentid });
    if (!student) return res.status(400).send("Student not found.");

    const cafe = await Cafe.findOne({ user: student._id, enddate: { $gt: Date.now() } });
    if (!cafe) return res.status(400).send("You are not subscribed to a cafe.");

    const currentMeal = await getCurrentTimeOfDay();
    if (!currentMeal) return res.status(400).send("It's not time for breakfast, lunch, or dinner.");

    const existingCafe = await CafeGate.findOne({
      user: student._id,
      Date: { $gte: new Date().setHours(0, 0, 0), $lt: new Date().setHours(23, 59, 59) },
    });

    if (existingCafe && existingCafe[currentMeal]) {
      return res.status(400).send(`${currentMeal} has already been checked for today.`);
    }

    const cafegates = await CafeGate.findOneAndUpdate(
      { user: student._id, Date: { $gte: new Date().setHours(0, 0, 0), $lt: new Date().setHours(23, 59, 59) } },
      { $set: { [currentMeal]: true } },
      { new: true, upsert: true }
    );
    return res.send(`${currentMeal} checked for today.`);
  } catch (err) {
    return res.status(500).send(err.message || "Something went wrong.");
  }
});




const getUserSubscriptions = async (userId) => {
  return await Cafe.findOne({ user: userId, enddate: { $gt: Date.now() } });
};

const checkValidSubscription = async (userId) => {
  const subs = await getUserSubscriptions(userId);
  if (subs) throw new Error("Already Subscribed");
};

const handleChapaPayment = async (user, price, res) => {
  const customerInfo = {
    amount: price,
    currency: "ETB",
    email: user.auth.email,
    first_name: user.firstName,
    last_name: user.lastName,
    customization: { title: "Test Title", description: "Test Description" },
    meta: { reference: user._id },
  };

  try {
    const response = await myChapa.initialize(customerInfo, { autoRef: true });
    return res.send({
      response,
      email: user.auth.email,
      price: price,
      StartDate: new Date(),
      EndDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error initializing payment");
  }
};


Router.get("/initiateChapa", AuthMiddleware, async (req, res) => {
  try {
    const { redirecturl } = req.query;
    if (!redirecturl) return res.status(400).send("Missing redirect URL");

    await checkValidSubscription(req.user.userid);

    const user = await User.findById(req.user.userid)
      .select("-password")
      .populate("auth");

    const Cafeprice = 1255;
    await handleChapaPayment(user, Cafeprice, res);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});
Router.post('/MealTimes', async (req, res) => {
  try {
    const {
      breakfastStart,
      breakfastEnd,
      lunchStart,
      lunchEnd,
      dinnerStart,
      dinnerEnd,
    } = req.body;

    // Validate that all times are provided
    if (
      !breakfastStart ||
      !breakfastEnd ||
      !lunchStart ||
      !lunchEnd ||
      !dinnerStart ||
      !dinnerEnd
    ) {
      return res.status(400).send('All meal times must be provided.');
    }

    // Check if meal times already exist
    let mealTimes = await MealTimes.findOne();
    if (mealTimes) {
      // Update existing meal times
      mealTimes.breakfastStart = breakfastStart;
      mealTimes.breakfastEnd = breakfastEnd;
      mealTimes.lunchStart = lunchStart;
      mealTimes.lunchEnd = lunchEnd;
      mealTimes.dinnerStart = dinnerStart;
      mealTimes.dinnerEnd = dinnerEnd;
    } else {
      // Create new meal times
      mealTimes = new MealTimes({
        breakfastStart,
        breakfastEnd,
        lunchStart,
        lunchEnd,
        dinnerStart,
        dinnerEnd,
      });
    }

    // Save to the database
    await mealTimes.save();
    return res.send('Meal times updated successfully.');
  } catch (err) {
    res.status(500).send('Error updating meal times: ' + err.message);
  }
});
Router.get("/MealTimes", async (req, res) => {
  try {
    const mealTimes = await MealTimes.findOne();
    return res.send(mealTimes);
  } catch (err) {
    res.status(500).send("Error retrieving meal times: " + err.message);
  }
}
);


Router.post("/cafeinfo/verify", async (req, res) => {
  try {
    const { reference } = req.body.meta;
    const cafe = new Cafe({
      location: "JIJIGA",
      user: reference,
    });
    await cafe.save();
    return res.send(cafe);
  } catch (err) {
    res.status(500).send("Error verifying cafe info");
  }
});

Router.delete("/unsubscribe/:id", async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndDelete(req.params.id);
    if (!cafe) return res.status(400).send("Subscription not found");
    return res.send(cafe);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});

Router.get("/subscription/status", AuthMiddleware, async (req, res) => {
  try {
    const cafe = await getUserSubscriptions(req.user.userid);
    return res.send({ status: !!cafe });
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});

Router.get("/subscriptions", AuthMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) return res.status(400).send("Month and year parameters are required.");
    const parsedMonth = parseInt(month);
    const parsedYear = parseInt(year);
    if (isNaN(parsedMonth) || isNaN(parsedYear)) return res.status(400).send("Invalid month or year format.");
    if (parsedMonth < 1 || parsedMonth > 12) return res.status(400).send("Month must be between 1 and 12.");

    const startDate = new Date(parsedYear, parsedMonth - 1, 1);
    const endDate = new Date(parsedYear, parsedMonth, 0);
    const cafes = await Cafe.find({ startdate: { $gte: startDate, $lte: endDate } });
    return res.send(cafes);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});

Router.get("/subscriptions/report", async (req, res) => {
  try {
    const cafes = await Cafe.find().populate("user");
    return res.send(cafes);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});

Router.post("/subscribe/manual", async (req, res) => {
  const session = await Cafe.startSession();
  session.startTransaction();
  try {
    let usersToSubscribe = Array.isArray(req.body.users) ? req.body.users : [req.body.users];
    const subscriptions = [];

    for (let userId of usersToSubscribe) {
      const subs = await getUserSubscriptions(userId);
      if (subs) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).send(`User ${userId} is already subscribed`);
      }

      const cafe = new Cafe({ location: req.body.location, user: userId });
      await cafe.save({ session });
      subscriptions.push(cafe);
    }

    await session.commitTransaction();
    session.endSession();
    return res.send(subscriptions);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send("Subscription failed: " + err.message);
  }
});



Router.get("/report", async (req, res) => {
  try {
    const cafe = await CafeGate.find()
    return res.send(cafe);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});

module.exports = Router;
