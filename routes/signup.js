const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Employee = require('../models/users/employee');
const Manager = require('../models/users/manager');
// const session=require('express-session');
// const mongoStore=require('connect-mongo');
const passport = require('passport');
const task = require('./task');
const { redirect } = require('react-router-dom');

var app = express()


app.use(passport.initialize());
app.use(passport.session())

require('./auth');


router.post("/signup", async (req, res) => {
    console.log("Request Body:", req.body);
    // console.log("Request Body:", req.body);
    console.log("UserType:", req.body.UserType);

    try {
        const existingEmployee = await Employee.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });
        if (existingEmployee) {
            return res.status(409).json({ error: "User with this email or username already exists" });
        }
        const existingManager = await Manager.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });
        if (existingManager) {
            return res.status(409).json({ error: "User with this email or username already exists" });
        }

        let managerId;
        try {
            // Check if manager_id exists in the Manager collection
            const manager = await Manager.findOne({ username: req.body.manager_id });
            managerId = manager._id;
        
            // If manager is not found, return an error
            if (!manager) {
                return res.status(409).json({ error: "Manager with this username does not exist" });
            }
        
            // Continue with user registration process...
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        
        let User;
        let userData = {
            email: req.body.email,
            username: req.body.username,
            manager_id: req.body.manager_id, 
        } 
        if (req.body.UserType === 'employee') {
            User = Employee;
            userData.manager_id = managerId;
            userData.userType='employee'
        }
        else {
            User = Manager;
            userData.userType='manager'
        }

        User.register(userData, req.body.password, async (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error setting password" });
            }
            passport.authenticate('local')(req, res, function () {
                res.status(201).json(user);
                // res.redirect(`/dashboard?userType=${UserType}`);
            })
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
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


router.post('/login', async (req, res, next) => {
    const { Username, password } = req.body;

    try {
        const employeeExists = await Employee.findOne({ username: Username });
        const managerExists = await Manager.findOne({ username: Username });

        let UserType;
        let authenticatedUser;

        if (employeeExists) {
            UserType = 'employee';
            authenticatedUser = await Employee.authenticate()(Username, password);
        } else if (managerExists) {
            UserType = 'manager';
            authenticatedUser = await Manager.authenticate()(Username, password);
        } else {
            console.log("error");
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Further processing with authenticatedUser...
        if (authenticatedUser) {
            // console.log("Authenticated user:", authenticatedUser);s
            if (authenticatedUser.user) {
                return res.status(200).json({user: authenticatedUser});
            }
        } else {
            return res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/login', async (req, res, next) => {
    
})

module.exports = router;