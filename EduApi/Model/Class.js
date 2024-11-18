const mongoose = require("mongoose");
const joi = require("joi");

const classSchema = new mongoose.Schema({
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

const Class = mongoose.model("Class", classSchema);

const joischema = joi.object({
  yearLevel: joi.string().required().valid("1", "2", "3", "4", "5"),
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
    ),
  semister: joi.string().required().valid("1", "2"),
});
const validateClass = (classs) => {
  return joischema.validate(classs);
};

module.exports = { Class, validateClass };
