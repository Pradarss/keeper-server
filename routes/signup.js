const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Employee = require('../models/users/employee');
const Manager = require('../models/users/manager');

router.post("/signup", async (req, res) => {
    try {
        const existingEmployee=await Employee.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });
        if(existingEmployee){
            return res.status(409).json({ error: "User with this email or username already exists" });
        }
        const existingManager=await Manager.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });
        if(existingManager){
            return res.status(409).json({ error: "User with this email or username already exists" });
        }
        let user;
        if ('manager_id' in req.body) {
            user = new Employee({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                manager_id: req.body.manager_id,
            });
        }
        else {
            user = new Manager({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
            });
        }
        const doc = await user.save();
        console.log(doc);
        res.json(doc);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// router.get("/signup", async (req, res) => {
//     const docs = await Employee.find({});
//     res.json(docs);
// })

module.exports = router;