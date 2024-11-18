const mongoose = require("mongoose");
const joi = require("joi");

const semisterSchema = new mongoose.Schema({
  AcadamicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcadamicYear",
    required: true,
  },
  semister: {
    type: String,
    required: true,
    enum: ["1", "2"],
  },
  startdate: {
    type: Date,
  },
  enddate: {
    type: Date,
  },
});
const Semister = mongoose.model("Semister", semisterSchema);

const joischema = joi.object({
  AcadamicYear: joi.string().required(),
  semister: joi.string().required().valid("1", "2"),
  startdate: joi.date(),
  enddate: joi.date(),
});
const validateSemister = (semister) => {
  return joischema.validate(semister);
};

module.exports = { Semister, validateSemister };
