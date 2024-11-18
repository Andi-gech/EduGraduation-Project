const mongoose = require("mongoose");
const joi = require("joi");
const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        enum:["Computer Science","electronics","civil","Mechanical","Electrical","Aeronautical","Production","chemical","Motor Vehicles"]
    },
    date: {
        type: Date,
        default: Date.now
    },

})
const Department = mongoose.model("Department", departmentSchema);
const joischema = joi.object({
    name: joi.string().valid("Computer Science","electronics","civil","Mechanical","Electrical","Aeronautical","Production","chemical","Motor Vehicles").required(),
});
const ValidateDepartment = (department) => {
    return joischema.validate(department);
}
module.exports = { Department, ValidateDepartment }