const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/users/manager');
const Employee = require('../models/employees/manager');
const { compareSync } = require('bcrypt');

passport.use('user-local', new LocalStrategy(
    function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Incorrect Username' }); }
            if (compareSync(password, user.password)) { return done(null, false, { message: 'Incorrect Password' }); }
            return done(null, user);
        });
    }
));

passport.use('employee-local', new LocalStrategy(
    function (username, password, done) {
        Employee.findOne({ username: username }, function (err, employee) {
            if (err) { return done(err); }
            if (!employee) { return done(null, false, { message: 'Incorrect Username' }); }
            if (compareSync(password, employee.password)) { return done(null, false, { message: 'Incorrect Password' }); }
            return done(null, employee);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, { id: user.id, type: user.type }); // Serialize with user ID and type
});

passport.deserializeUser(function(serializedUser, done) {
    if (serializedUser.type === 'user') {
        User.findById(serializedUser.id, function(err, user) {
            done(err, user);
        });
    } else if (serializedUser.type === 'employee') {
        Employee.findById(serializedUser.id, function(err, employee) {
            done(err, employee);
        });
    } else {
        done(new Error('Invalid user type'));
    }
});