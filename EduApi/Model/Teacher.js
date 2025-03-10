const mongoose = require("mongoose");
const Joi = require("joi");

const teacherSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
      },
    isMilitary: {
        type: Boolean,
        default: false,
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
        nullable: true,
      }
});

const Teacher = mongoose.model("Teacher", teacherSchema);

const validateTeacher = (teacher) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(20).required(),
        lastName: Joi.string().min(3).max(20).required(),
        email: Joi.string().email().required(),
         gender: Joi.string().valid("Male", "Female").required(),
        isMilitary: Joi.boolean(),
        department: Joi.string().valid( 
            "Computer Science",
            "electronics",
            "civil",
            "Mechanical",
            "Electrical",
            "Aeronautical",
            "Production",
            "chemical",
            "Motor Vehicles"),
    });
    return schema.validate(teacher);
}

module.exports.Teacher = Teacher;
module.exports.validateTeacher = validateTeacher;


