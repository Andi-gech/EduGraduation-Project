const mongoose = require("mongoose");
const joi = require("joi");

const acadamicYearSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const AcadamicYear = mongoose.model("AcadamicYear", acadamicYearSchema);

const joischema = joi.object({
  year: joi.string().required(),
  startDate: joi.date().required(),
  endDate: joi.date().required(),
});
const validateAcadamicYear = (acadamicYear) => {
  return joischema.validate(acadamicYear);
};
module.exports = {
  AcadamicYear,
  validateAcadamicYear,
};
