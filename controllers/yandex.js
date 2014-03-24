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
      title: title,
      access: 'public'
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
        req.track.addPhoto(JSON.parse(body), function(err) {
          if (err) throw err;
        });
        console.log(counter);
        counter--;
        if (counter === 0) {
          next();
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
};


exports.updateGeoTags = function(req, res, next) {
  var auth = 'OAuth ' + req.user.authToken;
  req.track.images.forEach(function(image, index) {
    setTimeout(function() {
      request({
        url: image.self,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;type=entry',
          Authorization: auth
        }
      }, function(err, response, body) {
        if (err) throw err;
        var geo;
        try {
          geo = (JSON.parse(body)).geo.coordinates;
          req.track.addCoordinates(geo.split(' '), index, function(err) {
            if (err) throw err;
          });
        } catch (e) {
          log.error(e);
          console.log(e);
        }
      });
    }, 5000);
  });
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
    if (err) log.error(err);
    var albums = [];
    // console.log(JSON.parse(body));
    JSON.parse(body).entries.forEach(function(album) {
      albums.push({
        alternate: album.links.alternate,
        title: album.title,
        imageCount: album.imageCount
      });
    });
    req.reqUser.albums = albums;
    next();
  });
};


/**
 * Показывает галерею изображений
 */

exports.show = function(req, res, next) {
  Track.findById(req.track.id, 'images', function(err, track) {
    if (err) return next(404, err);
    if (track) {
      res.render('yandex/list', {
        title: 'Галерея',
        images: track.images,
        id: req.track.id
      });
    }
  });
};

/**
 * Удаляет изображение.
 */

exports.removePhoto = function(req, res) {
  Track.findById(req.track.id, function(err, track) {
    if (err) return next(404, err);
    if (track) {
      var removeLink;
      //Обработка ошибки на тот случай если фотография уже удалена
      try {
        removeLink = track.images.id(req.params.iId).self;
        track.images.id(req.params.iId).remove();
        track.save(function(err) {
          if (err) throw err;
        });
        request({
          url: removeLink,
          method: 'DELETE',
          headers: {
            Authorization: 'OAuth ' + req.user.authToken
          }
        }, function(err, response, body) {
          log.info('Фотография удалена успешно');
        });
      } catch (e) {
        log.error('Фотография уже удалена, ' + e);
      }
    }
  });
  res.redirect('/track/' + req.track.id + '/galery');
};

exports.removeAlbum = function(req, res, next) {
  if (req.track.album.self) {
    request({
      url: req.track.album.self,
      method: 'DELETE',
      headers: {
        Authorization: 'OAuth ' + req.user.authToken
      }
    }, function(err, response, body) {
      log.info('Альбом успешно удален');
    });
    req.flash('success', 'Альбом успешно удален');
    res.redirect('/track/list');
  } else {
    req.flash('error', 'Альбом связанный с Я.Фотками не существовал.');
    res.redirect('/track/list');
  }
};

/*exports.showInfo = function(req, res) {
  var auth = 'OAuth ' + req.user.authToken;
  req.track.images.forEach(function(image) {
    console.log(image._id);
    if (image._id == req.params.iId) {
      request({
        url: image.self,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;type=entry',
          Authorization: auth
        }
      }, function(err, response, body) {
        if (err) throw err;
        console.log(JSON.parse(body).geo.coordinates);
      });
    }
  });
  res.redirect('/track/' + req.track.id + '/galery');
};
*/
