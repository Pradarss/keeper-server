const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Manager = require('../models/users/manager');
const Employee = require('../models/users/employee');

passport.use('manager-local', Manager.createStrategy());
passport.use('employee-local', Employee.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, { id: user.id, type: user.constructor.modelName });
});

passport.deserializeUser(function(obj, done) {
  if (obj.type === 'Manager') {
    Manager.findById(obj.id, function(err, manager) {
      done(err, manager);
    });
  } else if (obj.type === 'Employee') {
    Employee.findById(obj.id, function(err, employee) {
      done(err, employee);
    });
  } else {
    done(new Error('Unknown model type'));
  }
});

