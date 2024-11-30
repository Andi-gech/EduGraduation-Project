const express = require("express");
const Router = express.Router();
const { User, validateUser } = require("../Model/User");
const QRCode = require("qrcode");
const sharp = require("sharp");
const Authetication = require("../MiddleWare/AuthMiddleware");
const upload = require("../utils/multerConfig");
const { signData, verifyData } = require("../utils/Signiture");
const { encrypt, decrypt } = require("../utils/Crypto");

const { Class } = require("../Model/Class");
const { Auth } = require("../Model/Auth");
const AuthMiddleware = require("../MiddleWare/AuthMiddleware");
const { IDCard } = require("../Model/IDCard");
const fs = require("fs");
const path = require("path");
const sendMail = require("../utils/sendmail");

Router.post("/", Authetication, async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const classRoom = await Class.findOne({
      department: req.body.department,
      year: req.body.yearLevel,
      semester: req.body.semister,
    });
    if (!classRoom) return res.status(400).send("Class not found");

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      auth: req.body.auth,

      gender: req.body.gender,
      studentid: req.body.studentid,

      yearLevel: req.body.yearLevel,
      department: req.body.department,
      semister: req.body.semister,

      profilePic: req.body.profilePic,
    });

    const result = await user.save();
    sendMail(
      req.body.email,
      "User Registration",
      `Hello ${req.body.firstName}, \n You have been registered successfully`
    );
    res.send(result);
  } catch (err) {
    res.send(err.message);
  }
});
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     tokenAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: JWT token required (without Bearer)
 *
 * /user/me:
 *   get:
 *     summary: Retrieve the authenticated user's profile information.
 *     tags:
 *       - User
 *     security:
 *       - tokenAuth: []  # JWT token required (without Bearer)
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the user.
 *                 email:
 *                   type: string
 *                   description: Email of the user.
 *                 Role:
 *                   type: string
 *                   description: Role of the user.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       403:
 *         description: Forbidden - User lacks sufficient permissions.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal server error"
 */

Router.get("/me", AuthMiddleware, async (req, res) => {
  // Simulate a delay (5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    const user = await User.findById(req.user.userid)
      .select("-password") // Exclude password from the response
      .populate("Class"); // Populate related Class data

    console.log("user", user); // Corrected from console.long to console.log
    res.send(user);
  } catch (err) {
    console.error(err.message); // Log the error message
    res.status(500).send(err.message); // Send a 500 status for server error
  }
});

/**
 * @swagger
 * /user/GenerateQR:
 *   get:
 *     summary: Generate a QR code for the authenticated user.
 *     tags:
 *       - QR Code
 *     security:
 *       - tokenAuth: []  # JWT token required (without Bearer)
 *     responses:
 *       200:
 *         description: QR code generated successfully.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal server error"
 */
Router.get("/GenerateQR", Authetication, async (req, res) => {
  try {
    const user = await User.findOne({ auth: req.user._id });
    if (!user) return res.status(400).send("User not found");

    // Prepare user data
    const userdata = {
      name: user.firstName + " " + user.lastName,
      birthdate: user.dob,
      expiredDate: "2022-12-12",
      gender: user.gender,
      dateofIssue: Date.now(),
    };

    // Encrypt user ID and sign data
    const encrypted = encrypt(req.user._id);
    const signed = signData(encrypted);
    const datatoEncode = encrypted + ":" + signed;

    // Generate QR code
    const qrcode = await QRCode.toDataURL(datatoEncode);

    // Assuming the path to the user's profile picture
    const profilePicPath = user?.profilePic;
    const darkenedProfilePicPath = "uploads/output12.jpg"; // Specify where to save the darkened image

    // Process user profile picture to convert it to black and white
    await sharp(profilePicPath)
      .grayscale() // Convert the image to black and white
      .toFile(darkenedProfilePicPath);
    return res.send({
      userdata: userdata,
      qrurl: qrcode,
      darkenedProfilePic: darkenedProfilePicPath, // Include the path to the darkened image
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error: " + err.message);
  }
});

/**
 * @swagger
 * /user/getprofilepic/{id}:
 *   get:
 *     summary: Get the profile picture of a user by ID.
 *     tags:
 *       - User
 *     security:
 *       - tokenAuth: []  # JWT token required (without Bearer)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user whose profile picture is to be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's profile picture.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: User not found.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal server error"
 */
Router.get("/getprofilepic/:id", Authetication, async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { profilePic: 1 });
    if (!user) return res.status(400).send("User not found");
    res.send(user.profilePic);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
/**
 * @swagger
 * /user/updateProfilePic:
 *   put:
 *     summary: Update the user's profile picture.
 *     tags:
 *       - User
 *     security:
 *       - tokenAuth: []  # JWT token required (without Bearer)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully updated the user's profile picture.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the user.
 *                 profilePic:
 *                   type: string
 *                   description: URL/path of the updated profile picture.
 *       400:
 *         description: No file uploaded.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal server error"
 */
Router.put(
  "/updateProfilePic",
  Authetication,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const uploadedFile = req.file;
      if (!uploadedFile) return res.status(400).send("No file uploaded");
      req.body.profilePic = uploadedFile.path;
      const user = await User.findOneAndUpdate(
        { auth: req.user._id },
        {
          profilePic: req.body.profilePic,
        },
        { new: true }
      );

      res.send(user);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

/**
 * @swagger
 * user/verifyQR:
 *   post:
 *     summary: Verify the QR code data and return decrypted information.
 *     tags:
 *       - QR Code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               qrurl:
 *                 type: string
 *                 description: The QR code URL or data.
 *     responses:
 *       200:
 *         description: Successfully verified the QR code and returned decrypted data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: Decrypted data from the QR code.
 *       400:
 *         description: Invalid QR code.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal server error"
 */
Router.post("/verifyQR", async (req, res) => {
  try {
    const qrurl = req.body.qrurl;

    // Extract encrypted data and signature from QR code
    const data = qrurl.split(":");

    const encrypted = data[0] + ":" + data[1];
    const signed = data[2];

    // Decrypt the encrypted data
    const datatoDecode = decrypt(encrypted);

    // Verify the signature
    const verified = verifyData(encrypted, signed);

    if (verified) {
      // Signature is valid, send the decrypted data
      res.send(datatoDecode);
    } else {
      // Signature verification failed, QR code is invalid
      res.status(400).send("Invalid QR code");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retrieve user information by ID.
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the user.
 *                 email:
 *                   type: string
 *                   description: Email of the user.
 *                 role:
 *                   type: string
 *                   description: Role of the user.
 *       404:
 *         description: User not found.
 *       400:
 *         description: Invalid user ID.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal server error"
 */
Router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.send(user);
  } catch (err) {
    res.send(err.message);
  }
});

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve all users.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users.
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
 *                   role:
 *                     type: string
 *                     description: Role of the user.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
Router.get("/", async (req, res) => {
  try {
    const user = await User.find().populate("Class auth");
    res.send(user);
  } catch (err) {
    res.send(err.message);
  }
});

Router.put("/pushnotification", AuthMiddleware, async (req, res) => {
  try {
    console.log(req.body);
    console.log("setting push token", req.user);
    const user = await User.findByIdAndUpdate(
      req.user.userid,
      {
        PushToken: req.body.pushToken,
      },
      { new: true }
    );
    console.log(user);

    res.send(user);
  } catch (err) {
    res.send(err.message);
  }
});
Router.get("/get/Digitalid", AuthMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({
      auth: req.user._id,
    });
    if (!user) return res.status(400).send("User not found");

    let idCard = await IDCard.findOne({ Auth: req.user._id });
    console.log(idCard);
    if (!idCard) {
      const encrypted = encrypt(req.user._id);
      const signed = signData(encrypted);
      const datatoEncode = encrypted + ":" + signed;

      // Generate QR code
      const qrcode = await QRCode.toDataURL(datatoEncode);
      idCard = await IDCard.create({
        Auth: user.auth,
        EnglishFirstName: user.firstName,
        EnglishLastName: user.lastName,
        IDNumber: user.studentid,
        DateOfBirth: user.dob,
        National: "Ethiopian",
        Gender: user.gender,
        Qr: qrcode,
      });
      console.log("ID card created", idCard);
    }
    if (idCard.isComplete === false) {
      console.log("ID card not complete");
      return res
        .status(400)
        .send(
          "User ID card requested sucessfully go to registral office to complete the process"
        );
    }
    res.send(idCard);
  } catch (error) {
    res.status(500).send("Error retrieving digital ID card");
  }
});
Router.get("/getAll/Digitalid", async (req, res) => {
  try {
    const idCards = await IDCard.find({
      isComplete: false,
    });
    res.send(idCards);
  } catch (error) {
    res.status(500).send("Error retrieving digital ID card");
  }
});
Router.get("/Digitalid/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const ids = await IDCard.findById(id);
    if (!ids) {
      return res.status(404).send("ID card not found");
    }
    res.send(ids);
  } catch (error) {
    res.status(500).send("Error retrieving digital ID card");
  }
});

const TEMP_DIR = path.join(__dirname, "temp"); // Path to the temp directory
const UPLOADS_DIR = path.join(__dirname, "uploads"); // Path to the uploads directory

// Ensure the temp and uploads directories exist
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

Router.put(
  "/update/Digitalid/:id",
  upload.single("IdPhoto"),
  async (req, res) => {
    try {
      const uploadedFile = req.file;

      if (!req.params.id) {
        return res.status(400).send("ID is required to update the ID card.");
      }

      const idCard = await IDCard.findById(req.params.id);
      if (!idCard) {
        return res.status(404).send("ID card not found.");
      }

      if (uploadedFile) {
        const originalFilePath = uploadedFile.path;
        const tempFilePath = path.join("temp", uploadedFile.filename);
        const processedFilePath = path.join("uploads", uploadedFile.filename);

        fs.renameSync(originalFilePath, tempFilePath);
        await sharp(tempFilePath).grayscale().toFile(processedFilePath);
        req.body.pic = `uploads/${uploadedFile.filename}`;
        fs.unlinkSync(tempFilePath);
      }
      console.log(req.body);
      const updatedIdCard = await IDCard.findByIdAndUpdate(
        req.params.id,
        {
          Photo: req.body.pic ? req.body.pic : idCard.Photo,
          EnglishFirstName:
            req.body.EnglishFirstName || idCard.EnglishFirstName,
          EnglishLastName: req.body.EnglishLastName || idCard.EnglishLastName,
          AmharicFirstName:
            req.body.AmharicFirstName || idCard.AmharicFirstName,
          AmharicLastName: req.body.AmharicLastName || idCard.AmharicLastName,
          EnglishMiddleName:
            req.body.EnglishMiddleName || idCard.EnglishMiddleName,
          AmharicMiddleName:
            req.body.AmharicMiddleName || idCard.AmharicMiddleName,
          IDNumber: req.body.IDNumber || idCard.IDNumber,
          DateOfBirth: req.body.DateOfBirth || idCard.DateOfBirth,
          DateOfIssue: req.body.DateOfIssue || idCard.DateOfIssue,
          DateOfExpiry: req.body.DateOfExpiry || idCard.DateOfExpiry,
          National: req.body.National || idCard.National,
          isComplete: req.body.isCompleted || idCard.isComplete,
        },
        { new: true }
      );

      res.send(updatedIdCard);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
);

module.exports = Router;
