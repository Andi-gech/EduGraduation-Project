const mongoose = require("mongoose");
const Joi = require("joi");

const authSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  Role: {
    type: String,
    required: true,
    default: "student",
    enum: [
      "systemadmin",
      "teacher",
      "student",
      "library",
      "StudentOfficer",
      "AcademicOfficer",
      "Cafe",
      "HumanResource",
      "WardControll",
    ],
  },
  emailToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isapproved: {
    type: Boolean,
    default: false,
  },
});

const Auth = mongoose.model("Auth", authSchema);

const validateAuth = (auth) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    Role: Joi.string().valid(
      "systemadmin",
      "teacher",
      "student",
      "library",
      "StudentOfficer",
      "AcademicOfficer",
      "Cafe",
      "HumanResource",
      "WardControll"
    ),
    password: Joi.string()
      .min(6)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$"
        )
      )
      .required(),
    emailToken: Joi.string(),
  });

  return schema.validate(auth);
};

module.exports = {
  Auth,
  validateAuth,
};
