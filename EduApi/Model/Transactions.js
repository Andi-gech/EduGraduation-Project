const mongoose = require("mongoose");
const Joi = require("joi");

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
    
        
       
    },
    mobile: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "Pending",
        enum: ["Pending", "Success", "Failed"],
    },
    transactionId: {
        type: String,
        required: true,
    },
    transactionDate: {
        type: Date,
        default: Date.now(),
    },
    });

const Transaction = mongoose.model("Transaction", transactionSchema);

const validateTransaction = (transaction) => {
    const schema = Joi.object({
        user: Joi.string().required(),
        amount: Joi.number().required(),
        paymentMethod: Joi.string(),
        mobile: Joi.string(),
        status: Joi.string(),
        
       
        transactionId: Joi.string().required(),
        transactionDate: Joi.date(),
    });
    return schema.validate(transaction);
}

module.exports= {
    Transaction,
    validateTransaction,
};