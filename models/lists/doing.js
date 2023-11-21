const mongoose = require("mongoose");

const doingSchema = mongoose.Schema({
    task: String,
    time: String,
    manager_id: String,
    employee_id: String,
})

Doing = mongoose.model('Doing',doingSchema);

module.exports = Doing;