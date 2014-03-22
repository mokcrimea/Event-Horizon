/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Track = mongoose.model('Track'),
  request = require('request'),
  fs = require("fs"),
  util = require('util'),
  async = require('async'),
  log = require('../lib/log')(module);

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

exports.new = function(req, res) {
  res.render('yandex/upload', {
    title: 'Загрузка фотографий к треку',
  });
};

exports.createAndUpload = function(req, res, next) {

  var formidable = require('formidable');
  var form = new formidable.IncomingForm();
  form.multiples = true;
  var files = [];
  var album_url;
  var title = new Date().toJSON().substr(0, 19);
  var options = {
    url: 'http://api-fotki.yandex.ru/api/users/' + req.user.username + '/albums/',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;type=entry',
      Authorization: 'OAuth ' + req.user.authToken
    },
    body: ''
  };

  form.on('file', function(field, file) {
    files.push(file.path);
  });
  form.parse(req);
  form.on('end', function() {
    options.body = JSON.stringify({
      title: title
    });

    /**
     * Делаем проверку на существование. Если существует, то загружаем в него,
     * иначе создаем новый альбом.
     */
    if (!req.track.album.title) {
      async.series([
          createAlbum,
          uploadPhotos,
          response
        ],
        function(err, results) {
          if (err) throw err;
        });
    } else {
      album_url = req.track.album.link;
      async.series([
          uploadPhotos,
          response
        ],
        function(err, results) {
          if (err) throw err;
        });
    }

  });

  function createAlbum(callback) {
    request(options, function(err, responce, body) {

      if (err) {
        log.error(err);
        next(500);
        throw err;
      } else {
        log.info('Альбом "' + title + '" успешно создан');
      }

      album_url = JSON.parse(body).links.photos;

      req.track.createAlbum(JSON.parse(body), function(err) {
        if (err) throw err;
      });
      callback();
    });
  }

  function uploadPhotos(callback) {
    log.info('Отправляю фоточки на сервер в: \n' + album_url);
    options.url = album_url;
    options.headers['Content-Type'] = 'image/png';

    async.each(files, function(file) {
      options.body = fs.readFileSync(file);

      request(options, function(err, responce, body) {
        if (err) {
          log.error(err);
          next(500);
          throw err;
        }
        req.track.addPhoto(JSON.parse(body).img);
        log.info('Завершил загрузку фотографии: ' + file);
        fs.unlink(file, function(err) {
          if (err) throw err;
        });
      });

    }, function(err) {
      if (err) throw (err);
      next(500);
    });
    if (typeof(callback) == "function") {
      callback();
    }
  }

  function response(callback) {
    Track.findById(req.track.id, 'images', function(err, track) {
      if (err) return next(404, err);
      if (track) {
        res.render('yandex/list', {
          title: 'Галерея',
          images: track.images
        });
      }
    });

    if (typeof(callback) == "function") {
      callback();
    }
  }

  next(404);

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
    console.log(body);
    next(404);
  });
};

exports.show = function(req, res, next) {
  Track.findById(req.track.id, 'images', function(err, track) {
    if (err) return next(404, err);
    if (track) {
      console.log(track);
      res.render('yandex/list', {
        title: 'Галерея',
        images: track.images
      });
    }
  });
};
