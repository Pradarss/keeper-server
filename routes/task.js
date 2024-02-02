const express = require('express');
const router = express.Router();
const Todo = require('../models/lists/todo');
// const getCurrentTime = require('../time');

function getCurrentTime(){
  const date = new Date();
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return date.toLocaleTimeString('en-US', options);
  }

router.get("/dashboard", (req,res)=>{
  Todo.find()
  .then(tasks => {
    res.json(tasks);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });
})

router.post("/dashboard/manager", (req,res)=>{
  // console.log("Received request body:", req.body);
    const { task} = req.body;

    const newTask = new Todo({
      task : task,
      time : getCurrentTime(),
      status : "TODO",
    });

    console.log(newTask);

    newTask.save()
    .then(savedTask => {
      // console.log(savedTask);
      res.status(201).json(savedTask);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
})

router.post("/dashboard/employee/doing",(req,res)=>{
  const {id} = req.body;

  Todo.findByIdAndUpdate(id, { status: 'DOING' }, { new: true })

  .then(updatedTask => {
    console.log(updatedTask);
    res.status(201).json(updatedTask);
  })
  .catch (err => {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  })
});



module.exports = router;