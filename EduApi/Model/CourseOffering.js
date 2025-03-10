const mongoose = require("mongoose");
const joi = require("joi");
const scheduleItemSchema = new mongoose.Schema({
  day: {
    type: String,
  
  },
  Start: {
    type: String, // Use Date if storing actual timestamps
   
  },
  End: {
    type: String, // Use Date if storing actual timestamps
   
  },
});
const CourseOfferingSchema = new mongoose.Schema({
  courses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      Schedule: [scheduleItemSchema],
    },
  ],
  yearLevel: {
    type: String,
    required: true,
    enum: ["1", "2", "3", "4", "5"],
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
      "Motor Vehicles",
    ],
  },
  semister: {
    type: String,
    required: true,
    enum: ["1", "2"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const CourseOffering = mongoose.model("CourseOffering", CourseOfferingSchema);

const joischema = joi.object({
  courses: joi
    .array()
    .items(
      joi.object({
        course: joi.string().required(),
        teacher: joi.string(),
        Schedule: joi.array().items(
          joi.object({
            day: joi
              .string()
              .valid(
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
              )
              .required(),
            Start: joi.string().required(),
            End: joi.string().required(),
          })
        ),
      })
    )
    .required(),
  yearLevel: joi.string().valid("1", "2", "3", "4", "5").required(),
  semister: joi.string().valid("1", "2").required(),
  department: joi
    .string()
    .valid(
      "Computer Science",
      "electronics",
      "civil",
      "Mechanical",
      "Electrical",
      "Aeronautical",
      "Production",
      "chemical",
      "Motor Vehicles"
    )
    .required(),
});

const validate = (joiobject) => {
  return joischema.validate(joiobject);
};

module.exports = { CourseOffering, validate };
