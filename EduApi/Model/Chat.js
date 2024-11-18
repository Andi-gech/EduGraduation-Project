const mongoose = require("mongoose");
const joi = require("joi");
const chatSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },

  room: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

const joischema = joi.object({
  message: joi.string().required(),
  sender: joi.string().required(),
  room: joi.string().required(),
});
module.exports = {
  Chat,
  joischema,
};
