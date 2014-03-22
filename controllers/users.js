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
 * Форма логина
 */

exports.login = function(req, res) {
  res.render('user/login', {
    title: 'Авторизация'
  });
};

/**
 * Форма регистрации
 */

exports.signup = function(req, res) {
  res.render('user/signup', {
    title: 'Регистрация',
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
      log.debug(err);
      return res.render('user/signup', {
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
 * Список треков пользователя
 */

exports.list = function(req, res) {
  User.list(req.user.id, function(err, user) {
    var tracks = user.tracks;
    if (tracks.length === 0) {
      // ..Добавить INFO блок
      return res.render('track/upload', {
        title: 'Загрузка нового трека',
        success: 'У вас нет загруженый треков. Можете загрузить новый с помощью формы ниже'
      });
    }
    res.render('track/list', {
      title: 'Tracks',
      tracks: tracks
    });
  });
};

/**
 * Профиль пользователя
 */

exports.show = function(req, res, next) {
  res.render('user/show', {
    title: req.reqUser.name,
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
