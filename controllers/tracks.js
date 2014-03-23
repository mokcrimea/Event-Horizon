/**
 * Основные зависимости
 */

var mongoose = require('mongoose'),
  Track = mongoose.model('Track'),
  fs = require("fs"),
  HttpError = require('../error').HttpError,
  path = require('path'),
  createFolders = require('../lib/createUserFolder'),
  log = require('../lib/log')(module);

/**
 * Загрузка информации о треке
 */

exports.load = function(req, res, next, id) {
  var trackPath = '/tmp/' + id + '/track';
  Track.findById(id, 'name _creator created images album', function(err, track) {
    if (err) return next(404, err);
    if (track) {
      req.track = track;
      fs.readFile(trackPath, function(err, data) {
        if (err) return next(404, err);
        req.track.track = data;
        next();
      });
    } else {
      next(new HttpError(404, 'Трек не существует'));
    }
  });
};

/**
 * Главная страница
 */

exports.index = function(req, res) {
  res.render('index', {
    title: 'Главная'
  });
};

/**
 * Загрузка нового трека
 */

exports.new = function(req, res) {
  res.render('track/upload', {
    title: 'Загрузка нового трека',
  });
};

/**
 * Отображение трека
 */

exports.show = function(req, res, next) {
  var images = [];
  req.track.images.forEach(function(image) {
    images.push([image.coordinates[0], image.links.M.href]);
  });
  var track = req.track;
  res.render('track/show', {
    title: track.name,
    coord: track.track,
    track: track,
    images: images
  });
};

/**
 * Создание нового трека
 */

exports.create = function(req, res) {
  var formidable = require('formidable');
  var parseTrack = require('../lib/parseTrack');
  var track = new Track({});
  var username = req.user.username;
  var trackId = track.id;
  var uploadDir = '/tmp/' + trackId;
  var form = new formidable.IncomingForm();
  // form.uploadDir = uploadDir;
  createFolders(trackId, function(err) {
    if (err) throw err;

    form.parse(req, function(error, fields, files) {

      fs.readFile(files.upload.path, function(err, Data) {
        if (err) throw err;

        parseTrack(Data, uploadDir, function(err) {
          if (err) throw err;
          fs.unlink(files.upload.path, function(err) {
            if (err) throw err;
          });

          track.create(fields.title, req.user, function(err) {

            if (err) throw err;
            log.info('Трек успешно создан');
            req.flash('success', 'Трек успешно загружен');
            res.redirect('/track/' + track.id);
          });
        });
      });
    });

  });

};

/**
 * Редактировать трек
 */

exports.edit = function(req, res) {

};

/**
 * Обновить трек
 */

exports.update = function(req, res) {

};

/**
 * Удалить трек
 */

exports.delete = function(req, res, next) {
  Track.remove(req.track.id, function(err) {
    if (err) return next(404, err);
  });
  fs.unlink('/tmp/' + req.track.id + '/track', function(err) {
    if (err) log.error(err);
    fs.unlink('/tmp/' + req.track.id + '/full', function(err) {
      if (err) log.error(err);
      fs.rmdir('/tmp/' + req.track.id + '/', function(err) {
        if (err) log.error(err);
      });
    });
  });
  next();
};
