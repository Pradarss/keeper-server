const mongoose = require("mongoose");

const doneSchema = mongoose.Schema({
    task: String,
    time: String,
    manager_id: String,
    employee_id: String,
})

Done = mongoose.model('Done',doneSchema);

module.exports = Done;