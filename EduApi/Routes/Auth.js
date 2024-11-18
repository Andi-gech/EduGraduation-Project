const express = require("express");
const Router = express.Router();
const { Auth, validateAuth } = require("../Model/Auth");
const { securePassword, comparePassword } = require("../utils/Secure");
const { generateAuthToken } = require("../utils/jwt");
const mongoose = require("mongoose");
const { User, validateUser } = require("../Model/User");
const { Class, validateClass } = require("../Model/Class");
const { Chatroom } = require("../Model/Chatrooms");
const swagger = require("../utils/swagger");

/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *           pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$"
 *         Role:
 *           type: string
 *           enum: ["systemadmin", "teacher", "student", "library", "StudentOfficer", "AcademicOfficer", "Cafe", "HumanResource", "WardControll"]
 *       required:
 *         - email
 *         - password
 *         - Role
 *     User:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         studentid:
 *           type: string
 *         gender:
 *           type: string
 *         isMilitary:
 *           type: boolean
 *         auth:
 *           type: string
 *         Class:
 *           type: string
 *     Class:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               auth:
 *                 $ref: '#/components/schemas/Auth'
 *               user:
 *                 $ref: '#/components/schemas/User'
 *               class:
 *                 $ref: '#/components/schemas/Class'
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
Router.post("/register", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { error: authError } = validateAuth(req.body.auth);
    if (authError) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send(authError.details[0].message);
    }

    // Validate user data
    const { error: userError } = validateUser(req.body.user);
    if (userError) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send(userError.details[0].message);
    }

    // Check if email already exists
    let auth = await Auth.findOne({ email: req.body.auth.email }).session(
      session
    );
    if (auth) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send("Email already registered.");
    }

    // Hash password

    const hashedPassword = securePassword(req.body.auth.password);

    auth = new Auth({
      email: req.body.auth.email,
      password: hashedPassword,
      Role: req.body.auth.Role,
    });
    await auth.save({ session });

    const { error: classError } = validateClass(req.body.class);
    if (classError) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send(classError.details[0].message);
    }

    let classRoom = await Class.findOne(req.body.class).session(session);

    if (!classRoom) {
      classRoom = new Class(req.body.class);
      await classRoom.save({ session });
    }

    // Create new User document
    const user = new User({
      firstName: req.body.user.firstName,
      lastName: req.body.user.lastName,
      auth: auth._id,
      Class: classRoom._id,
      studentid: req.body.user.studentid,

      gender: req.body.user.gender,

      isMilitary: req.body.user.isMilitary,
    });

    await user.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Respond with created user (excluding sensitive information)
    res.send({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: auth.email,
        dob: user.dob,
        gender: user.gender,
        phone: user.phone,
        yearLevel: user.yearLevel,
        department: user.department,
        semester: user.semester,
        address: user.address,
        profilePic: user.profilePic,
        date: user.date,
        isMilitary: user.isMilitary,
      },
    });
  } catch (err) {
    await session.abortTransaction();

    session.endSession();
    res.status(500).send(err.message);
  }
});
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user and return a JWT token on successful authentication.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User login credentials.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *                 example: "andi@gmail.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$"
 *                 description: User's password.
 *                 example: "10987126@Ndi"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authorization.
 *                 isapproved:
 *                   type: boolean
 *                   description: Indicates if the user is approved.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique identifier for the authenticated user.
 *                     email:
 *                       type: string
 *                       description: Email of the authenticated user.
 *                     userid:
 *                       type: string
 *                       description: Profile ID associated with the authenticated user.
 *       400:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid email or password"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal server error"
 */

Router.post("/login", async (req, res) => {
  try {
    const { error } = validateAuth(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    const user = await Auth.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");
    const validPassword = comparePassword(req.body.password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
    const Profile = await User.findOne({
      auth: user._id,
    });

    const token = generateAuthToken({
      _id: user._id,
      email: user.email,
      Role: user.Role,
      userid: Profile._id,
    });
    res.send({
      token: token,
      isapproved: user.isapproved,
      user: {
        id: user._id,
        email: user.email,
        userid: Profile._id,
      },
    });
  } catch (err) {
    res.send(err.message);
  }
});
/**
 * @swagger
 * /auth/approve/{id}:
 *   put:
 *     summary: Approve a user by ID
 *     description: Updates the user's approval status to true.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to approve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the user.
 *                 isapproved:
 *                   type: boolean
 *                   description: Approval status of the user.
 *                 firstName:
 *                   type: string
 *                   description: First name of the user.
 *                 lastName:
 *                   type: string
 *                   description: Last name of the user.
 *                 email:
 *                   type: string
 *                   description: Email of the user.
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
Router.put("/approve/:id", async (req, res) => {
  try {
    console.log("req.params.id", req.params.id);
    const user = await Auth.findById(req.params.id);

    if (!user) return res.status(404).send("User not found");
    user.isapproved = true;
    await user.save();
    res.send(user);
  } catch (err) {
    res.send(err.message);
  }
});

/**
 * @swagger
 * /auth/inactive:
 *   get:
 *     summary: Retrieve inactive (not approved) users
 *     description: Fetches a list of users whose approval status is false.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of inactive users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier for the user.
 *                   email:
 *                     type: string
 *                     description: Email of the user.
 *                   firstName:
 *                     type: string
 *                     description: First name of the user.
 *                   lastName:
 *                     type: string
 *                     description: Last name of the user.
 *                   isapproved:
 *                     type: boolean
 *                     description: Indicates if the user is approved (false for inactive users).
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal server error"
 */
Router.get("/inactive", async (req, res) => {
  try {
    const users = await Auth.find({ isapproved: false });
    const userProfiles = await User.find({ auth: { $in: users } }).populate(
      "auth"
    );
    res.send(userProfiles);
  } catch (err) {
    res.send(err.message);
  }
});
module.exports = Router;
