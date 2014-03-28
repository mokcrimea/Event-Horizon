/**
 * Основные зависимости
 */

var mongoose = require('mongoose'),
  Track = mongoose.model('Track'),
  fs = require("fs"),
  HttpError = require('../error').HttpError,
  path = require('path'),
  createFolders = require('../lib/createUserFolder'),
  formatDate = require('../lib/utils').formatDate,
  log = require('../lib/log')(module);

/**
 * Загрузка информации о треке
 */

exports.load = function(req, res, next, id) {
  Track.findById(id, 'name _creator created images album distance', function(err, track) {
    if (err) return next(404, err);
    if (track) {
      req.track = track;
      next();
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
  var trackPath = '/tmp/' + req.track.id + '/track';
  var images = [];
  req.track.images.forEach(function(image) {
    if (image.coordinates[0]) {
      if (image.links.L.href) {
        images.push([image.coordinates[0], image.links.L.href, image.title]);
      } else {
        images.push([image.coordinates[0], image.links.orig.href, image.title]);
      }
    }
  });
  var track = req.track;

  fs.readFile(trackPath, function(err, data) {
    if (err) return next(404, err);
    res.render('track/show', {
      title: track.name,
      coord: data.toString(),
      track: track,
      images: images
    });
  });
};

/**
 * Создание нового трека
 */

exports.create = function(req, res, next) {
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
    /*    form.on('aborted', function() {
      req.flash('error', 'Прозошла ошибка при загрузке файла');
      res.redirect('/upload');
    });*/

    form.parse(req, function(error, fields, files) {
      try {
        fs.readFile(files.upload.path, function(err, Data) {
          if (err) throw err;

          parseTrack(Data, uploadDir, function(err, distance) {
            // На случай если формат файла не правильный
            if (err) {
              fs.unlink(files.upload.path, function(err) {
                if (err) throw err;
              });
              fs.rmdir('/tmp/' + trackId + '/', function(err) {
                if (err) log.error(err);
              });
              return next(new HttpError(err, 'Неправильный формат загружаемого файла'));
            }

            fs.unlink(files.upload.path, function(err) {
              if (err) throw err;
            });

            track.create(fields.title, req.user, distance, function(err) {

              if (err) throw err;
              log.info('Трек успешно создан');
              req.flash('success', 'Трек успешно создан');
              res.redirect('/track/' + track.id);
            });
          });
        });
      } catch (e) {
        log.debug(e);
        res.redirect('/upload');
      }
    });

  });

};

/**
 * Удалить трек
 */

exports.delete = function(req, res, next) {
  Track.findByIdAndRemove(req.track.id, function(err) {
    if (err) return next(404, err);
    log.info('Трек успешно удален из базы');
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
