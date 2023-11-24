const express = require('express');
const router = express.Router();
const Todo = require('../models/lists/todo');

router.post("/dashboard", (req,res)=>{
    const { task, time } = req.body;

    const newTask = new Todo({
      task,
      time,
    });

    console.log(newTask);

    newTask.save()
    .then(savedTask => {
      console.log('Task saved successfully');
      res.status(201).json(savedTask);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
})