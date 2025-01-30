const express = require("express");
const Router = express.Router();
const { Auth, validateAuth, validateAuthpassword } = require("../Model/Auth");
const { securePassword, comparePassword } = require("../utils/Secure");
const { generateAuthToken } = require("../utils/jwt");
const mongoose = require("mongoose");
const { User, validateUser } = require("../Model/User");
const { Class, validateClass } = require("../Model/Class");
const { Teacher, validateTeacher } = require("../Model/Teacher");
const { Chatroom } = require("../Model/Chatrooms");
const swagger = require("../utils/swagger");
const GenerateEmailCode = require("../utils/GenerateEmailCode");
const sendMail = require("../utils/sendmail");
const AuthMiddleware = require("../MiddleWare/AuthMiddleware");



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
    const emailToken = GenerateEmailCode();
    auth = new Auth({
      email: req.body.auth.email,
      password: hashedPassword,
      Role: req.body.auth.Role,
      emailToken: emailToken,
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
    console.log("emailToken", emailToken);

    sendMail(
      req.body.auth.email,
      "Email Verification",
      `<h1>Email Verification</h1>
      <p>Copy and paste the code below to verify your email</p>
      <strong>${emailToken}</strong>
      `
    );

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
Router.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await Auth.findOne({ email: email });
    if (!user) return res.status(404).send("User not found");
    if (user.emailToken !== code)
      return res.status(400).send("Invalid verification code");
    user.isVerified = true;
    await user.save();
    console.log("user verified");
    res.send("User verified successfully");
  } catch (err) {
    res.send(err.message);
  }
});
Router.post("/resendCode", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("email", email);
    const user = await Auth.findOne({ email: email });
    if (!user) return res.status(404).send("User not found");
    const emailToken = GenerateEmailCode();
    user.emailToken = emailToken;
    await user.save();
    sendMail(
      email,
      "Email Verification",
      `<h1>Email Verification</h1>
      <p>Copy and paste the code below to verify your email</p>
      <strong>${emailToken}</strong>
      `
    );
    res.send("Verification code sent successfully");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});
Router.post("/VerifyEmailforPassword", async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log("email", email);
    const user = await Auth.findOne({ email: email });
    if (!user) return res.status(404).send("User not found");
    if (user.emailToken !== code)
      return res.status(400).send("Invalid verification code");
    const token = generateAuthToken({
      _id: user._id,
      email: user.email,
      Role: user.Role,
      Profile: user?.Profile,
    });
    res.send({
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});
Router.post("/changepassword", AuthMiddleware, async (req, res) => {
  try {
    const { password } = req.body;
    const { error } = validateAuthpassword(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    console.log("req.user", req.user);
    const user = await Auth.findById(req.user._id);
    if (!user) return res.status(404).send("User not found");
    user.password = securePassword(password);
    await user.save();
    res.send("Password changed successfully");
  } catch (err) {
    res.send(err.message);
  }
});
Router.post("/createTeacher",  async (req, res) => {
 

  try {
    const {error}=validateTeacher(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const TeacherExist=await Teacher.findOne({email:req.body.email})
    if(TeacherExist) return res.status(400).send("Teacher already exist")
    const teacher=new Teacher({
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      email:req.body.email,
     department:req.body.department,
     gender:req.body.gender,
      isMilitary:req.body.isMilitary
    })
    await teacher.save()
    res.send(teacher) 
    
  } catch (err) {
    
    res.status(500).send(err.message);
  }
});
Router.get("/generate/admin", async (req, res) => {
  try {
    const password = securePassword("10987126@Ndi");
    const email = "admin@admin.com";
    const Role = "systemadmin";
    const admin= await Auth.findOne({ email: email });
    if (admin) return res.status(400).send("Admin already created");
    
    const auth = new Auth({
      email: email,
      password: password,
      Role: Role,
      isapproved: true,
      isVerified: true,
    });
    await auth.save();
    res.send("Admin created successfully");
  } catch (err) {
    res.send(err.message);
  }
});

Router.post("/login", async (req, res) => {
  try {
    const { error } = validateAuth(req.body);
    console.log(error);

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
      isVerified: user.isVerified,
      user: {
        id: user._id,
        email: user.email,
        userid: Profile._id,
        Role: user.Role,
      },
    });
  } catch (err) {
    res.send(err.message);
  }
});

Router.post("/adminlogin", async (req, res) => {
  try {
    const { error } = validateAuth(req.body);
    console.log(error);

    if (error) return res.status(400).send(error.details[0].message);
    const user = await Auth.findOne(
      { email : req.body.email, Role: "systemadmin" }
    )
    if (!user) return res.status(400).send("Invalid email or password");
    const validPassword = comparePassword(req.body.password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
  
    const token = generateAuthToken({
      _id: user._id,
      email: user.email,
      Role: user.Role,
    });
    res.send({
      token: token,
      user: {
        id: user._id,
        email: user.email,
        Role: user.Role,

      },
    });
  } catch (err) {
    res.send(err.message);
  }
});
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
