const mongoose = require("mongoose");
const joi = require("joi");
const EnrollCourseSchema = new mongoose.Schema({

    course: 
        
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        }
       
    ,
    currentYear: {
        type: String,
        enum: ["1", "2", "3", "4", "5"],
        required: true
    },
    currentSemester: {
        type: String,
        enum: ["1", "2"],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
    

})

const EnrollCourse = mongoose.model("EnrollCourse", EnrollCourseSchema);

const joischema = joi.object({
    course: joi.string().required(),
    currentYear: joi.string().valid("1", "2", "3", "4", "5").required(),
    currentSemester: joi.string().valid("1", "2").required(),
    user: joi.string().required(),
});
const ValidateEnrollCourse = (EnrollCourse) => {
    return joischema.validate(EnrollCourse);
}

module.exports = {
    EnrollCourse,
    ValidateEnrollCourse
}