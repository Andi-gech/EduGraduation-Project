const mongoose = require("mongoose");
const joi = require("joi");

const complainSchema = new mongoose.Schema({
  complain: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["dormitary", "class", "admin", "security", "other"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "resolved", "rejected"],
    default: "pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Complain = mongoose.model("Complain", complainSchema);

const joischema = joi.object({
  complain: joi.string().required(),
  type: joi.string().valid().required(),
});
const validateComplain = (complain) => {
  return joischema.validate(complain);
};

module.exports = {
  Complain,
  validateComplain,
};
