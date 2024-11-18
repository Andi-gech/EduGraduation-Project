const mongoose = require("mongoose");
const joi = require("joi");

const cafeGateSchema = new mongoose.Schema({
  Date: {
    type: Date,
    default: Date.now,
  },
  BreakFast: {
    type: Boolean,
    default: false,
  },
  Lunch: {
    type: Boolean,
    default: false,
  },
  Dinner: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const CafeGate = mongoose.model("CafeGate", cafeGateSchema);

const joischema = joi.object({
  Date: joi.date(),
  BreakFast: joi.boolean(),
  Lunch: joi.boolean(),
  Dinner: joi.boolean(),
  user: joi.string().required(),
});

const validateCafeGate = (cafeGate) => {
  return joischema.validate(cafeGate);
};
module.exports = {
  CafeGate,
  validateCafeGate,
};
