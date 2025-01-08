const mongoose = require("mongoose");
const joi = require("joi");

const GateSchema = new mongoose.Schema({
    Date: {
        type: Date,
        default: Date.now,
    },
    Entry: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    });
const Gate = mongoose.model("Gate", GateSchema);

const joischema = joi.object({
    Date: joi.date(),
    Entry: joi.boolean(),
    user: joi.string().required(),
});

const validateGate = (gate) => {
    return joischema.validate(gate);
};

module.exports = {
    Gate,
    validateGate,
};