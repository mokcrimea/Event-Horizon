/**
 * Основные зависимости
 */

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  log = require('../lib/log')(module),
  HttpError = require('../lib/error').HttpError;

/**
 * Загружает информацию о пользователе в req.reqUser
 */

exports.load = function(req, res, next, id) {
  User.findById(id, 'id authToken name username tracks created', function(err, user) {
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
 * Отображает страницу принятия пользовательского соглашения Яндекс.Фото
 */

exports.signup = function(req, res, next) {
  if (req.session.become == 'yandex-terms') {
    delete req.session.become;
    res.render('user/signup', {
      title: 'Необходимо принять пользовательское соглашение'
    });
  } else {
    next(new HttpError(403, 'Ошибка доступа'));
  }
};

/**
 * Редиретит на страницу которая была перед логином
 */

exports.redirect = function(req, res) {
  var redirect = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(redirect);
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

exports.show = function(req, res) {
  res.render('user/profile', {
    title: 'Ваш профиль',
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
