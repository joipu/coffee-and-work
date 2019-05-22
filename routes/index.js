var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing');
});

// Show register form
router.get('/register', function(req, res){
  res.render('register', {page: 'register'});
})

// Handle sign-up logic
router.post('/register', function(req,res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if (err) {
      return res.render('register', {error: err.message});
    }
    passport.authenticate('local')(req, res, function(){
      req.flash('success', 'You are successfully signed up. Welcome to Coffee & Work, ' + user.username + '!');
      res.redirect('/shops');
    });
  });
});


// Show login form
router.get('/login', function(req, res){
  res.render('login', {page: 'register'});
});

// Handle log-in logic
// app.post('/login', middleware, callback)
router.post('/login', passport.authenticate('local',
    {
      successRedirect: '/shops',
      failureRedirect: '/login',
      successFlash: 'Successfully logged in. Welcome back!',
      failureFlash: true
    }), function(req, res){
});

// Show logout route
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/shops');
});

module.exports = router;