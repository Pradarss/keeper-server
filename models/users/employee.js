const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const employeeSchema = mongoose.Schema({
    email: {
        type: String,
        // required: true,
        unique: true,
    },
    username: {
        type: String,
        // required: true,
        unique: true
    },
    password: String,
    manager_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager'
    },
    userType: String,
})

employeeSchema.plugin(passportLocalMongoose);

Employee = mongoose.model('Employee',employeeSchema);

module.exports = Employee;