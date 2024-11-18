const mongoose = require("mongoose");
const joi = require("joi");

const socialSchema = new mongoose.Schema({
  clubname: {
    type: String,
    required: true,
  },
  clubdescription: {
    type: String,
    required: true,
  },
  clubMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Social = mongoose.model("Social", socialSchema);

const joischema = joi.object({
  clubname: joi.string().required(),
  clubdescription: joi.string().required(),
});

const validateSocial = (social) => {
  return joischema.validate(social);
};

module.exports = { Social, validateSocial };
