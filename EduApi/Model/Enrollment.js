const mongoose = require("mongoose");
const joi = require("joi");

const EnrollmentSchema = new mongoose.Schema({
  Course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);

const Enrollmentjoischema = joi.object({
  Course: joi.string().required(),
  user: joi.string().required(),
});
const ValidateEnrollment = (Enrollment) => {
  return Enrollmentjoischema.validate(Enrollment);
};

module.exports = {
  Enrollment,
  ValidateEnrollment,
};
