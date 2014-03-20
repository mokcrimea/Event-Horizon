/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  request = require('request'),
  fs = require("fs");

/**
 * Load the service document
 */

exports.document = function(req, res, next) {
  var reUsername = /^\S[^\s]{3,20}/ig;
  request({
    url: 'http://api-fotki.yandex.ru/api/me/',
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;type=entry',
      Authorization: 'OAuth ' + req.user.authToken
    }
  }, function(err, responce, body) {
    if (err) console.log(err);
    var username = reUsername.exec(JSON.parse(body).title)[0];
    req.user.updateUsername(username, function(err) {
      if (err) throw err;
    });
    next();
  });
};

exports.createAlbum = function(req, res, next) {
  var title = 'Test';
  var options = {
    url: 'http://api-fotki.yandex.ru/api/users/' + req.user.username + '/albums/',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;type=entry',
      Authorization: 'OAuth ' + req.user.authToken
    },
    body: JSON.stringify({
      title: title
    })
  };
  request(options, function(err, responce, body) {
    if (err) console.log(err);
    req.user.createAlbum(JSON.parse(body), function(err) {
      if (err) throw err;
    });
    next(404);
  });
};

exports.upload = function(req, res, next) {
  var options = {
    url: 'http://api-fotki.yandex.ru/api/users/' + req.user.username + '/albums/',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;type=entry',
      Authorization: 'OAuth ' + req.user.authToken
    },
    body: JSON.stringify({
      title: title
    })
  };




};

exports.getAlbums = function(req, res, next) {
  var options = {
    url: 'http://api-fotki.yandex.ru/api/users/' + req.user.username + '/albums/',
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;type=entry',
      Authorization: 'OAuth ' + req.user.authToken
    }
  };
  request(options, function(err, response, body) {
    if (err) console.log(err);
    console.log(JSON.parse(body));
    next(404);
  });
};
