const mongoose = require("mongoose");
const joi = require("joi");

const cafeSchema = new mongoose.Schema({
    
    location: {
        type: String,
        enum:["JIJIGA","JIJIGA2","JIJIGA3","JIJIGA4","JIJIGA5"],
        required: true
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
  
        required: true
    },
    startdate: {
        type: Date,
        default: Date.now
    },
    enddate: {
        type: Date,
        default: () => Date.now() + (30 * 24 * 60 * 60 * 1000)
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Online"],
        default: "Cash",
        required: true
    }

});

const Cafe = mongoose.model("Cafe", cafeSchema);

const joischema = joi.object({
    location: joi.string().valid("JIJIGA","JIJIGA2","JIJIGA3","JIJIGA4","JIJIGA5").required(),
   
    
});
const validateCafe = (cafe) => {
    return joischema.validate(cafe);
}
module.exports = {
    Cafe,
    validateCafe
}