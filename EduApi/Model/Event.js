const mongoose = require("mongoose");
const joi = require("joi");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  eventdescription: {
    type: String,
    required: true,
  },
  StartDate: {
    type: String,
    required: true,
  },
  EndDate: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model("Event", eventSchema);

const joischema = joi.object({
  eventname: joi.string().required(),
  eventdescription: joi.string().required(),
  eventStartDate: joi.date().required(),
  eventEndDate: joi.date().required(),
});

const validateEvent = (event) => {
  return joischema.validate(event);
};

module.exports = { Event, validateEvent };
