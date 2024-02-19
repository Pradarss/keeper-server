const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Employee = require('../models/users/employee');
const Manager = require('../models/users/manager');
const session=require('express-session');
const mongoStore=require('connect-mongo');
const passport = require('passport');
const task= require('./task');

var app = express()


app.use(passport.initialize());  
app.use(passport.session())

require('./auth');
router.post("/signup", async (req, res) => {
    console.log("Request Body:", req.body);
    // console.log("Request Body:", req.body);
    console.log("UserType:", req.body.UserType);

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
        let User;
        let userData = {
            email: req.body.email,
            username: req.body.username,
            manager_id: req.body.manager_id, // Include the extra field here
        }
        if (req.body.UserType === 'employee') {
            User=Employee;
            userData.manager_id= req.body.manager_id;
        }
        else {
            User=Manager;
        }

        User.register(new User({email: req.body.email, username: req.body.username, }), req.body.password, async(err, user)=>{
            if(err){
                console.error(err);
                return res.status(500).json({error: "Error setting password"});
            }
            passport.authenticate('local')(req,res, function(){
                res.status(201).json(user);
            })
        });
    }
        catch(error){
            console.error(error);
            res.status(500).json({error: "Internal Server Error"});
        }
});

router.get("/signup", async (req, res) => {
    try {
        const docs = await Employee.find({});
        const docs1 = await Manager.find({});
        res.json({ employees: docs, managers: docs1 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/login', (req, res, next) => {
    const { UserType } = req.body;
    console.log("Request Body:", req.body);
    console.log("UserType:", req.body.UserType);

    let strategy;
    if (UserType === 'manager') {
        strategy = 'manager-local';
    } else if (UserType === 'employee') {
        strategy = 'employee-local';
    } else {
        return res.status(400).json({ error: "Invalid user type" });
    }

    passport.authenticate(strategy, { session: false }, (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        req.logIn(user, function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            return res.status(200).json({ message: "Login successful", user: user });
        });
    })(req, res, next);
});



module.exports = router;