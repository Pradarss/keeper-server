const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Employee = require('../models/users/employee');
const Manager = require('../models/users/manager');
const {hashSync}= require('bcrypt');
const session=require('express-session');
const mongoStore=require('connect-mongo');
const passport = require('passport');

var app = express()
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: mongoStore.create({mongoUrl : 'mongodb://127.0.0.1:27017/trelloDB', collectionName:"sessions"}),
  cookie: {
    maxAge: 1000*60*60*24
  }
}))

require('./auth');
app.use(passport.initialize());
app.use(passport.session())

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
        let user;
        if (req.body.UserType === 'employee') {
            user = new Employee({
                email: req.body.email,
                username: req.body.username,
                password: hashSync(req.body.password,10),
                manager_id: req.body.manager_id,
            });
        }
        else {
            user = new Manager({
                email: req.body.email,
                username: req.body.username,
                password: hashSync(req.body.password,10),
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

router.post("/login", passport.authenticate('local', { 
    successRedirect: '/dashboard', 
    failureRedirect: '/login', 
    failureFlash: true 
}));

module.exports = router;