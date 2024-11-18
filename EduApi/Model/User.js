const mongoose = require("mongoose");
const Joi = require("joi");
const { Class } = require("./Class");
const { Enrollment } = require("./Enrollment");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  isMilitary: {
    type: Boolean,
    default: false,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  auth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  studentid: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  phone: {
    type: Number,
  },
  Class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  PushToken: {
    type: String,
  },
  Enrollment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
    },
  ],
  address: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  incomponund: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),

    dob: Joi.date().optional(),
    gender: Joi.string().valid("Male", "Female").required(),
    phone: Joi.number().optional(),
    studentid: Joi.string().required(),

    isMilitary: Joi.boolean().default(false),
    Enrollment: Joi.array().items(Joi.string()).optional(),
    PushToken: Joi.string().optional(),

    address: Joi.string().optional(),
    profilePic: Joi.string().optional(),
    incomponund: Joi.boolean().default(false),
    date: Joi.date().default(Date.now),
  });

  return schema.validate(user);
};

module.exports = {
  User,
  validateUser,
};
