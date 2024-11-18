const mongoose = require("mongoose");
const joi = require("joi");
const Schema = mongoose.Schema;

const IDCardSchema = new Schema({
  Auth: {
    type: String,
    required: true,
  },
  EnglishFirstName: {
    type: String,
  },
  AmharicFirstName: {
    type: String,
  },
  EnglishMiddleName: {
    type: String,
  },
  AmharicMiddleName: {
    type: String,
  },
  EnglishLastName: {
    type: String,
  },
  AmharicLastName: {
    type: String,
  },
  IDNumber: {
    type: String,
  },
  DateOfBirth: {
    type: Date,
  },
  National: {
    type: String,
  },
  Gender: {
    type: String,
  },
  Qr: {
    type: String,
  },
  Photo: {
    type: String,
  },
  DateOfIssue: {
    type: Date,
  },
  DateOfExpiry: {
    type: Date,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
});

const IDCard = mongoose.model("IDCard", IDCardSchema);

const IDCardjoischema = joi.object({
  Auth: joi.string().required(),
  EnglishFirstName: joi.string(),
  AmharicFirstName: joi.string(),
  EnglishMiddleName: joi.string(),
  AmharicMiddleName: joi.string(),
  EnglishLastName: joi.string(),
  AmharicLastName: joi.string(),
  IDNumber: joi.string(),
  DateOfBirth: joi.date(),
  National: joi.string(),
  Gender: joi.string(),
  Qr: joi.string(),
  Photo: joi.string(),
  DateOfIssue: joi.date(),
  DateOfExpiry: joi.date(),
});
const ValidateIDCard = (IDCard) => {
  return IDCardjoischema.validate(IDCard);
};

module.exports = {
  IDCard,
  ValidateIDCard,
};
