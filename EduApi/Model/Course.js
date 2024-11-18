const mongoose = require("mongoose");
const joi = require("joi");
const CourseSchema=new mongoose.Schema({
    Coursename: {
        type: String,
        required: true
    },
    Coursecode: {
        type: String,
        required: true,
        unique: true
    },

    department: {
        type: String,
        enum:["Computer Science","electronics","civil","Mechanical","Electrical","Aeronautical","Production","chemical","Motor Vehicles"]
    },
    creaditHrs: {
        type: Number,
       
        default: 1,
        min: 1,
        max: 4

    },
    prequests: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    
    }]

})

const Course = mongoose.model("Course", CourseSchema);

const Coursejoischema = joi.object({
    Coursename: joi.string().required(),
    Coursecode: joi.string().required(),
    department: joi.string().valid("Computer Science","electronics","civil","Mechanical","Electrical","Aeronautical","Production","chemical","Motor Vehicles").required(),
        creaditHrs: joi.number().required(),
    prequests: joi.array()
});
 const ValidateCourse = (course) => {
    return Coursejoischema.validate(course);
 }
module.exports = {Course,ValidateCourse}