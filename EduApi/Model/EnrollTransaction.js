const mongoose = require("mongoose");
const joi = require("joi");

const enrollTransactionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    yearLevel: {
        type: String,
        required: true,
        enum: ["1", "2", "3", "4", "5"],
      },
      department: {
        type: String,
        enum:  [
          "Computer Science",
          "electronics",
          "civil",
          "Mechanical",
          "Electrical",
          "Aeronautical",
          "Production",
          "chemical",
          "Motor Vehicles"],
      },
      semister: {
        type: String,
        required: true,
        enum: ["1", "2"],
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

const EnrollTransaction = mongoose.model("EnrollTransaction", enrollTransactionSchema);

const enrollTransactionjoischema = joi.object({
    studentId: joi.string().required(),
    yearLevel: joi.string().required().valid("1", "2", "3", "4", "5"),
    paymentMethod: joi.string(),
    mobile: joi.string(),
    status: joi.string().required().valid("Pending", "Success", "Failed"),
    transactionId: joi.string().required(),
    transactionDate: joi.date(),
    amount: joi.number().required(),
    department: joi
      .string()
      .valid(
        
          "Computer Science",
          "electronics",
          "civil",
          "Mechanical",
          "Electrical",
          "Aeronautical",
          "Production",
          "chemical",
          "Motor Vehicles"
      ),
    semister: joi.string().required().valid("1", "2"),
});
const ValidateEnrollTransaction = (EnrollTransaction) => {
    return enrollTransactionjoischema.validate(EnrollTransaction);
};

module.exports = {
    EnrollTransaction,
    ValidateEnrollTransaction,
};