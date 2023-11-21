const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

const managerSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    manager_id: String,
})

// userSchema.plugin(passportLocalMongoose);

Manager = mongoose.model('Manager',managerSchema);

module.exports = Manager;