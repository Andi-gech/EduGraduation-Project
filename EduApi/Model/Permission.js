const mongoose = require("mongoose");
const joi = require("joi");

const permissionSchema = new mongoose.Schema({
    Reason: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    permissionDate: {
        type: Date,
        
    },
    status: {
        type: String,
        enum: ["pending", "approved", "denied"],
        default: "pending"
    },

    date: {
        type: Date,
        default: Date.now
    }
});

const Permission = mongoose.model("Permission", permissionSchema);

const joischema = joi.object({
    Reason: joi.string().required(),
    
    permissionDate: joi.date().required(),
    status: joi.string().valid("pending", "approved", "denied").default("pending"),
    date: joi.date().default(Date.now)
});

const validatePermission = (permission) => {
    return joischema.validate(permission);
};

module.exports = { Permission, validatePermission };