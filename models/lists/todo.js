const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    task: String,
    time: String,
    // manager_id: String,
})

Todo = mongoose.model('Todo',todoSchema);

module.exports = Todo;