/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  log = require('../lib/log')(module),
  HttpError = require('../error').HttpError;


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
      req.flash('success', 'Пользователь зарегистрирован');
      return res.redirect('/');
    });
  });
};

/**
 * Session
 */

exports.session = function(req, res) {
  var redirectTo = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};

/**
 * Update a User
 */

exports.update = function(req, res) {

};

/**
 * List of tracks
 */

exports.list = function(req, res) {
  User.list(req.user.id, function(err, user) {
    var tracks = user.tracks;
    res.render('track/list', {
      title: 'Tracks',
      tracks: tracks
    });
  });
};

/**
 * Show a user profile
 */

exports.show = function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) return next(err);
    if (!user) {
      log.debug('User not found');
      return next(new HttpError(404 ,'User not found'));
    }
    res.render('user/show', {
      title: user.name,
      user: user
    });
  });
};

/**
 * Logout
 */

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
