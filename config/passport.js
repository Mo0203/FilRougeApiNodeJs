const mongoose = require('mongoose');

const User = require('../models/userModel.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');


passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, (email, password, done) => {
  User.findOne({ email })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'error': 'email or password is invalid' } });
      }

      return done(null, user);
    }).catch(done);
}));