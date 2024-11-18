const mongoose = require("mongoose");
const joi = require("joi");

const CourseResourceSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },

  resource: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,

    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
});
const CourseResource = mongoose.model("CourseResource", CourseResourceSchema);

const joischema = joi.object({
  course: joi.string().required(),
  resource: joi.string().required(),
});
const ValidateCourseResource = (data) => {
  return joischema.validate(data);
};
module.exports = {
  CourseResource,
  ValidateCourseResource,
};
