const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    task: {
        type : String,
        required :  true,
    },
    time: {
        type : String,
        required :  true,
    },
    status: String,
    // manager_id: String,
})

Todo = mongoose.model('Todo',todoSchema);

module.exports = Todo;