const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Employee = require('../models/users/employee');
const Manager = require('../models/users/manager');
const passport = require('passport');
const task = require('./task');

var app = express()


app.use(passport.initialize());
app.use(passport.session())

require('./auth');


router.post("/signup", async (req, res) => {
    console.log("Request Body:", req.body);
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
        
        let User;
        let userData = {
            email: req.body.email,
            username: req.body.username,
            manager_id: req.body.manager_id, 
        } 
        if (req.body.UserType === 'employee') {
            let managerId;
        try {
            const manager = await Manager.findOne({ username: req.body.manager_id });
            managerId = manager._id;
            if (!manager) {
                return res.status(409).json({ error: "Manager with this username does not exist" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
            User = Employee;
            userData.manager_id = managerId;
            userData.userType='employee';
            const otherUser = await Manager.findById(userData.manager_id.toString());
            userData.OtherUser = otherUser;
        }
        else {
            User = Manager;
            userData.userType='manager';
            userData.OtherUser = [];
        }

        User.register(userData, req.body.password, async (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error setting password" });
            }
                res.status(201).json({user : {user}, userType: userData.userType,OtherUser: userData.OtherUser});
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
        let otherUser;

        if (employeeExists) {
            UserType = 'employee';
            authenticatedUser = await Employee.authenticate()(Username, password);
            otherUser = await Manager.findById(employeeExists.manager_id);
        } else if (managerExists) {
            UserType = 'manager';
            otherUser = await Employee.find({ manager_id: managerExists._id });
            authenticatedUser = await Manager.authenticate()(Username, password);
            console.log(otherUser);
        } else {
            console.log("error");
            return res.status(401).json({ error: "Invalid username or password" });
        }
        if (authenticatedUser) {
            if (authenticatedUser.user) {
                return res.status(200).json({user: authenticatedUser, userType: UserType, OtherUser: otherUser});
            }
        } else {
            return res.status(404).json({ error: "Invalid username or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
})

module.exports = router;