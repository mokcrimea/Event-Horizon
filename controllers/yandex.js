/**
 * Основные зависимости.
 */

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Track = mongoose.model('Track'),
  request = require('request'),
  fs = require("fs"),
  async = require('async'),
  log = require('../lib/log')(module);

/**
 * Загружает сервисный документ в котором ищет имя пользователя.
 * При авторизации через OAuth сервер не предоставляет имя
 * пользователя в явном виде
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

/*exports.createAlbum = function(req, res, next) {
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
};*/

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
     * Делаем проверку на существование альбома для текущего трека.
     *  Если существует, то загружаем в него, иначе  -
     *  создаем новый альбом.
     */
    if (!req.track.album.title) {
      async.series([
          createAlbum,
          uploadPhotos
        ],
        function(err, results) {
          if (err) throw err;
        });
    } else {
      album_url = req.track.album.link;
      async.series([
          uploadPhotos
        ],
        function(err, results) {
          if (err) throw err;
        });
    }

  });

  /**
   * Создает альбом с названием в виде: "2014-03-22T14:08:20"
   * @param  {Function} callback
   */

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

  /**
   * Загружает фотографии используя модуль node-formidable.
   * Сначала фотографии загружаеются на сервер, парсятся и отправляются на
   * Яндекс.Фото.
   * @param  {Function} callback
   */

  function uploadPhotos(callback) {
    var counter = files.length;
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
        log.info('Завершил загрузку фотографии: ' + file);
        req.track.addPhoto(JSON.parse(body).img);
        console.log(counter);
        counter--;
        if (counter === 0) {
          res.redirect('/track/' + req.track.id + '/galery');
        }
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

  /**
   * Рендерит галерею загруженных изображений
   * @param  {Function} callback
   */

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
};

/*exports.getAlbums = function(req, res, next) {
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
*/

/**
 * Показывает галерею изображений
 */

exports.show = function(req, res, next) {
  Track.findById(req.track.id, 'images', function(err, track) {
    if (err) return next(404, err);
    if (track) {
      res.render('yandex/list', {
        title: 'Галерея',
        images: track.images
      });
    }
  });
};
