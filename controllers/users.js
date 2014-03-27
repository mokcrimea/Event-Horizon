/**
 * Основные зависимости
 */

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  log = require('../lib/log')(module),
  HttpError = require('../error').HttpError;

/**
 * Загрузка информации о пользователе
 */

exports.load = function(req, res, next, id) {
  User.findById(id, 'id authToken name username tracks created yandex', function(err, user) {
    if (err) return next(404, err);
    if (user) {
      req.reqUser = user;
      next();
    } else {
      next(new HttpError(404, 'Пользователь не существует'));
    }
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
 * Список треков пользователя
 */

exports.list = function(req, res) {
  User.list(req.user.id, function(err, user) {
    var tracks = user.tracks;
    if (tracks.length === 0) {
      return res.render('track/upload', {
        title: 'Загрузка нового трека',
        success: 'У вас нет загруженых треков. Можете загрузить новый с помощью формы ниже'
      });
    }
    res.render('track/list', {
      title: 'Список загруженных треков',
      tracks: tracks
    });
  });
};

/**
 * Профиль пользователя
 */

exports.show = function(req, res, next) {
  res.render('user/profile', {
    title: 'Профиль пользователя ' + req.reqUser.name,
    user: req.reqUser
  });

};

/**
 * Выход
 */

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
