/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  User = require('models/user').User,
  HttpError = require('error').HttpError,
  AuthError = require('models/user').AuthError;

/**
 * Show login
 */

exports.login = function(req, res) {
  res.render('login');
};

/**
 * Create a User
 */

exports.create = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;


  User.authorize(username, password, function(err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
        return next(err);
      }
    }

    req.session.user = user._id;
    res.send({});

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
 * Delete a User
 */

exports.delete = function(req, res) {

};

/**
 * Logout
 */

exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
}