const express = require('express');
const router = express.Router();
const Todo = require('../models/lists/todo');
// const getCurrentTime = require('../time');

function getCurrentTime(){
  const date = new Date();
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return date.toLocaleTimeString('en-US', options);
  }

// router.get("/dashboard", (req,res)=>{
//   Todo.find()
//   .then(tasks => {
//     res.json(tasks);
//   })
//   .catch(err => {
//     console.log(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   });
// })

router.get("/dashboard", (req, res) => {
  const { status, manager_username } = req.query;
  
  // Create a query object with status and manager_username fields
  const query = {};
  if (status) {
    query.status = status;
  }
  if (manager_username) {
    query.manager_username = manager_username;
  }

  Todo.find(query)
    .then(tasks => {
      res.json(tasks);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


router.post("/dashboard/manager", (req,res)=>{
  // console.log("Received request body:", req.body);
  const { task, manager_username } = req.body;
    const newTask = new Todo({
      task : task,
      time : getCurrentTime(),
      status : "TODO",
      manager_username: manager_username
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

router.post("/dashboard/employee/:status",(req,res)=>{
  const {id, employeeUsername} = req.body;
  const { status } = req.params;

  Todo.findByIdAndUpdate(id, { status: status.toUpperCase(), employee_username: employeeUsername }, { new: true })

  .then(updatedTask => {
    console.log(updatedTask);
    res.status(201).json(updatedTask);
  })
  .catch (err => {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  })
});

router.delete("/dashboard/manager", (req,res)=>{
  const {id} = req.body;

  Todo.deleteOne({_id:id})

  .then(deletedTask => {
    console.log(deletedTask);
    res.status(201).json(deletedTask);
  })
  .catch (err => {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  })
})



module.exports = router;