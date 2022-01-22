const mongoose = require("mongoose");
const validator = require("validator");

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 3
    },
    lastname: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email ID Already Exists'],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email id");
            }
        }
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        min: 1000000000,
        max: 99999999999
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    confirmpassword: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    msg: {
        type: String,
        maxlength: 100
    }
});

const Employee = new mongoose.model("Employee", employeeSchema);

module.exports = Employee;