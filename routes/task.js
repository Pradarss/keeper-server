const express = require('express');
const router = express.Router();
const Todo = require('../models/lists/todo');
// const getCurrentTime = require('../time');

function getCurrentTime(){
  const date = new Date();
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return date.toLocaleTimeString('en-US', options);
  
  }

router.post("/dashboard", (req,res)=>{
  console.log("Received request body:", req.body);
    const { task, time } = req.body;

    const newTask = new Todo({
      task,
      time : getCurrentTime(),
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

module.exports = router;