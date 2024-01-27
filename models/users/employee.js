const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

const employeeSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
        unique: true
    },
    password: String,
    manager_id: String,
})

// userSchema.plugin(passportLocalMongoose);

Employee = mongoose.model('Employee',employeeSchema);

module.exports = Employee;