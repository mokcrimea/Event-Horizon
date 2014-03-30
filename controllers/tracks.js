/**
 * Основные зависимости
 */

var mongoose = require('mongoose'),
  Track = mongoose.model('Track'),
  fs = require("fs"),
  HttpError = require('../lib/error').HttpError,
  createFolders = require('../lib/utils').createFolders,
  tracksPath = require('../lib/utils').getTracksPath(),
  log = require('../lib/log')(module);

/**
 * Загрузка информации о треке
 */

exports.load = function(req, res, next, id) {
  Track.findById(id, 'name _creator created images album inform', function(err, track) {
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
  var images = [];

  req.track.images.forEach(function(image) {

    /**
     * Передаем в track/show только те картинки которые имеют GPS кординаты
     * и их размер минимум M (300px)
     */

    if (image.coordinates[0]) {
      if (!image.links.L) {
        try {
          images.push([image.coordinates[0], image.links.M.href, image.title]);
        } catch (e) {
          log.debug('Картинка очень маленького размера');
        }
      } else {
        images.push([image.coordinates[0], image.links.L.href, image.title]);
      }
    }
  });

  var track = req.track;

  fs.readFile(tracksPath + req.track.id + '/track', function(err, data) {
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
  // Библиотеки для загрузки файла и для парсинга .gpx
  var formidable = require('formidable'),
    parseTrack = require('../lib/parseTrack');

  var track = new Track({}),
    form = new formidable.IncomingForm(),
    trackId = track.id;

  createFolders(trackId, function(err) {
    if (err) throw err;

    form.parse(req, function(error, fields, files) {
      try {
        fs.readFile(files.upload.path, function(err, Data) {
          if (err) throw err;

          parseTrack(Data, tracksPath + trackId, function(err, inform) {
            // На случай если формат файла не правильный
            if (err) {
              fs.unlink(files.upload.path, function(err) {
                if (err) log.error(err);
              });
              fs.rmdir(tracksPath + trackId + '/', function(err) {
                if (err) log.error(err);
              });
              return next(new HttpError(415, 'Неправильный формат загружаемого файла'));
            }
            // Удаляем загруженный в /tmp/ файл потому что его уже распарсили
            fs.unlink(files.upload.path, function(err) {
              if (err) log.error(err);
            });

            track.create(fields.title, req.user, inform, function(err) {
              if (err) throw err;

              log.debug('Трек успешно создан');
              req.flash('success', 'Трек успешно создан');
              res.redirect('/track/' + track.id);

            });
          });
        });
      } catch (e) {
        log.error(e);
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

  fs.unlink(tracksPath + req.track.id + '/track', function(err) {
    if (err) log.error(err);
    fs.unlink(tracksPath + req.track.id + '/full', function(err) {
      fs.rmdir(tracksPath + req.track.id + '/', function(err) {
        if (err) log.error(err);
      });
    });
  });

  next();
};
