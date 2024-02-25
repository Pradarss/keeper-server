const LocalStrategy = require('passport-local').Strategy; 
const passport = require('passport');
const Employee = require('../models/users/employee');
const Manager = require('../models/users/manager');

// Configure Passport with Local Strategy for Employee
passport.use(new LocalStrategy(Employee.authenticate()));

// Serialize and deserialize Employee user
passport.serializeUser(Employee.serializeUser());
passport.deserializeUser(Employee.deserializeUser());

// Configure Passport with Local Strategy for Manager
passport.use(new LocalStrategy(Manager.authenticate()));

// Serialize and deserialize Manager user
passport.serializeUser(Manager.serializeUser());
passport.deserializeUser(Manager.deserializeUser());
