const mongoose = require("mongoose");
const joi = require("joi");
const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  ],
  Viwers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});
const Post = mongoose.model("Post", PostSchema);
const joischema = joi.object({
  content: joi.string().required(),
  image: joi.string(),
});
const validatePost = (post) => {
  return joischema.validate(post);
};
module.exports = { Post, validatePost };
