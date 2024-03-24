const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const managerSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    userType: String
})

managerSchema.plugin(passportLocalMongoose);

Manager = mongoose.model('Manager',managerSchema);

module.exports = Manager;