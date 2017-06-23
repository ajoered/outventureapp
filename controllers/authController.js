const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/account',
  successFlash: 'You are now logged in!'
});

exports.facebookCallback = passport.authenticate('facebook', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/account',
  successFlash: 'You are now logged in!'
}),

exports.authFacebook = passport.authenticate('facebook', { scope: ['email', 'public_profile'] })

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out! 👋');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'Oops you must be logged in to do that!');
  res.redirect('/login');
};
