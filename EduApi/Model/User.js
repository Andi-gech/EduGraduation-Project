const mongoose = require("mongoose");
const Joi = require("joi");

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
    nullable: true,
   
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  department: {
    type: String,
    enum: [
      "Computer Science",
      "electronics",
      "civil",
      "Mechanical",
      "Electrical",
      "Aeronautical",
      "Production",
      "chemical",
      "Motor Vehicles"],
    nullable: true,
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
  department: {
    type: String,
    enum: [
      "Computer Science",
      "electronics",
      "civil",
      "Mechanical",
      "Electrical",
      "Aeronautical",
      "Production",
      "chemical",
      "Motor Vehicles"],
    nullable: true,
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
    studentid: Joi.string(),
    department: Joi.string().optional(),

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

const validateTeacher = (teacher) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),

    dob: Joi.date().optional(),
    gender: Joi.string().valid("Male", "Female").required(),
    phone: Joi.number().optional(),
    studentid: Joi.string(),
    department: Joi.string().optional(),

    isMilitary: Joi.boolean().default(false),
    Enrollment: Joi.array().items(Joi.string()).optional(),
    PushToken: Joi.string().optional(),

    address: Joi.string().optional(),
    profilePic: Joi.string().optional(),
    incomponund: Joi.boolean().default(false),
    date: Joi.date().default(Date.now),
  });
  return schema.validate(teacher);
}



module.exports = {
  User,
  validateUser,
  validateTeacher,
};
