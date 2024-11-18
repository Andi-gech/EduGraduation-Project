const mongoose = require("mongoose");
const joi = require("joi");

const MarkProgressSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    progress: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const MarkProgress = mongoose.model("MarkProgress", MarkProgressSchema);

const joischema = joi.object({
    course: joi.string().required(),
    user: joi.string().required(),
    progress: joi.array().required(),
    date: joi.date()
});

module.exports = { MarkProgress, joischema }
