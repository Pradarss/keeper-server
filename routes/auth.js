const LocalStrategy = require('passport-local').Strategy; 
const passport = require('passport');
const Employee = require('../models/users/employee');
const Manager = require('../models/users/manager');

passport.use(new LocalStrategy(Employee.authenticate()));
passport.serializeUser(Employee.serializeUser());
passport.deserializeUser(Employee.deserializeUser());

passport.use(new LocalStrategy(Manager.authenticate()));
passport.serializeUser(Manager.serializeUser());
passport.deserializeUser(Manager.deserializeUser());
