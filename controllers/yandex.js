/**
 * Основные зависимости.
 */

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Track = mongoose.model('Track'),
  request = require('request'),
  fs = require("fs"),
  HttpError = require('../error').HttpError,
  async = require('async'),
  set_Options = require('../lib/utils').set_Options,
  log = require('../lib/log')(module);

/**
 * Загружает сервисный документ в котором ищет имя пользователя.
 * При авторизации через OAuth сервер не предоставляет имя
 * пользователя в явном виде
 */

exports.document = function(req, res, next) {
  var reUsername = /^\S[^\s]{3,20}/ig;
  request(set_Options(req, 'document'), function(err, responce, body) {
    if (err) console.log(err);
    try {
      var username = reUsername.exec(JSON.parse(body).title)[0];
      req.user.updateUsername(username, function(err) {
        if (err) throw err;
      });
    } catch (e) {
      log.debug('Необходимо принять соглашения яндекс фоток.');
      req.session.become = 'to';
      req.logout();
      return res.redirect('/signup');
    }
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
    title: 'Загрузка фотографий в галерею',
  });
};

/**
 * Создает альбом для трека если он отсутствует и
 * загружает в него фотографии
 */

exports.createAndUpload = function(req, res, next) {
  var formidable = require('formidable');
  var form = new formidable.IncomingForm();
  form.multiples = true;
  var files = [];
  var album_url;
  var maxSize = 20971520; // 20 мб.
  var count = 0;
  form.on('file', function(name, file) {
    log.info('Загрузил фотографию ' + file.name + ' на сервер.');
    var type = file.type;
    /**
     * Валидация загружаемых файлов на стороне сервера.
     * Проверяем размер фотографии и формат файла.
     */
    if (file.size > maxSize) {
      return next(new HttpError(413, 'Допускаются файлы размером не более 20 Мб.'));
    } else if (type != 'image/jpeg' && type != 'image/png' && type != 'image/gif' && type != 'image/bmp') {
      return next(new HttpError(415, 'Неправильный формат файла'));
    } else {
      files.push([file.path, file.name, file.type]);
    }
  });
  form.on('error', function(message) {
    log.debug(message);
    return next(400, message);
  });

  form.on('end', function() {

    /**
     * Делаем проверку на существование альбома для текущего трека.
     *  Если существует, то загружаем в него, иначе  -
     *  создаем новый альбом.
     */
    // Проверяем если длина массива с файлами 0,
    // значит ранее произошла ошибка 415
    if (files.length !== 0) {
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
        uploadPhotos();
      }
    }
  });
  form.parse(req);
  /**
   * Создает альбом с названием в виде: "2014-03-22T14:08:20"
   * @param  {Function} callback
   */

  function createAlbum(callback) {
    request(set_Options(req, 'create'), function(err, responce, body) {
      if (err) {
        log.error(err);
        next(500);
        throw err;
      } else {
        log.info('Альбом успешно создан');
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
    async.each(files, function(file) {
        fs.readFile(file[0], function(err, data) {
          if (err) console.log(err);
          request(set_Options(req, 'upload', {
            url: album_url,
            file: file,
            data: data
          }), function(err, responce, body) {
            if (err) {
              log.error(err);
              next(500);
              throw err;
            }
            log.info('Завершил загрузку фотографии: ' + file[1]);
            var imageParams;
            try {
              imageParams = JSON.parse(body);
            } catch (e) {
              log.error(body);
            }
            imageParams.title = file[1];
            req.track.addPhoto(imageParams, function(index) {
              // console.log('THE INDEX IS:  ' + index);
              setTimeout(function() {
                request(set_Options(req, 'getGPS', {
                  url: imageParams.links.self
                }), function(err, response, body) {
                  if (err) throw err;
                  var geo;
                  count++;
                  console.log('Проверяю координаты фотки: ' + count);
                  try {
                    geo = (JSON.parse(body)).geo.coordinates;
                    req.track.addCoordinates(geo.split(' '), index, function(err) {
                      if (err) throw err;
                    });
                  } catch (e) {
                    req.track.addCoordinates(null, index, function(err) {
                      if (err) throw err;
                    });
                    log.error(e);
                  }
                });

              }, 4000);
            });
            if (--counter === 0) {
              next();
              res.redirect('/track/' + req.track.id + '/galery');
            }
            fs.unlink(file[0], function(err) {
              if (err) throw err;
            });
          });

        });


      },

      function(err) {
        if (err) throw (err);
        next(500);
      });
    if (typeof(callback) == "function") {
      callback();
    }
  }
};



/*exports.updateGeoTags = function(req, res, next) {
  var auth = 'OAuth ' + req.user.authToken;
  req.track.images.forEach(function(image, index) {
    if (image.coordinates[0] !== null) {
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
            req.track.addCoordinates(null, index, function(err) {
              if (err) throw err;
            });
            log.error(e);
            console.log(e);
          }
        });
      }, 5000);
    }
  });
};*/




exports.getAlbums = function(req, res, next) {
  request(set_Options(req, 'album'), function(err, response, body) {
    if (err) log.error(err);
    var albums = [];
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

exports.gallery = function(req, res, next) {
  Track.findById(req.track.id, 'images', function(err, track) {
    if (err) return next(404, err);
    var images_links = [];
    if (track) {
      if (track.images.length === 0) {
        return res.render('yandex/upload', {
          title: 'Загрузка фотографий в галерею',
          success: 'У вас нет загруженых фотографий. Загрузить можно с помощью формы ниже'
        });
      }
      track.images.forEach(function(image, index) {
        images_links.push({
          links: image.links,
          _id: image._id
        });
      });
      res.render('yandex/gallery', {
        title: 'Галерея',
        // images: track.images,
        id: req.track.id,
        images: images_links
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
      res.render('yandex/gallery', {
        title: 'Галерея',
        images: track.images,
        id: req.track.id,
        // images: images_links
      });
    }
  });
  //!!!Проверить как будет лучше!!!
  // req.flash('success', 'Фотография успешно удалена');
  // res.redirect('/track/' + req.track.id + '/galery');
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
