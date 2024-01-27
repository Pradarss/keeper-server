const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

const managerSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
        unique: true
    },
    password: String,
})

// userSchema.plugin(passportLocalMongoose);

Manager = mongoose.model('Manager',managerSchema);

module.exports = Manager;