/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  User = mongoose.model('User');


/**
 * Login form
 */

exports.login = function(req, res) {
  res.render('user/login', {
    title: 'Login Page'
  });
};

/**
 * Sing up form
 */

exports.signup = function(req, res) {
  res.render('user/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Create a User
 */

exports.create = function(req, res, next) {
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function(err) {
    if (err) {
      return res.render('user/singup', {
        user: user,
        title: 'Sing Up'
      });
    }

    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  });
};

/**
 * Edit a User
 */

exports.edit = function(req, res) {

};

/**
 * Update a User
 */

exports.update = function(req, res) {

};

/**
 * Show a User
 */

exports.show = function(req, res) {
  var User = req.profile;
  res.render('user/show', {
    title: user.name,
    user: user
  });
};

/**
 * Find user by id
 */

exports.user = function(req, res, next, id) {
  User.findOne({_id: id}).exec(function(err, user){
    if (err) return next(err);
    if (!user) return next(new Error('failed to load user ' + id));
    req.profile = user;
    next();
  });
};

/**
 * Logout
 */

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
