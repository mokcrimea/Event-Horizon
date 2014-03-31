/**
 * Основные зависимости.
 */

var mongoose = require('mongoose'),
  Track = mongoose.model('Track'),
  request = require('request'),
  fs = require("fs"),
  HttpError = require('../lib/error').HttpError,
  createAlbum = require('../lib/utils').createAlbum,
  log = require('../lib/log')(module);

/**
 * Генерирует объект, в котором указаны параметры
 * запроса для request.
 */
var Options = require('../lib/utils').Options,
  options = new Options();

/**
 * Загружает сервисный документ в котором ищет имя пользователя.
 * При авторизации через OAuth сервер не предоставляет имя
 * пользователя в явном виде
 */

exports.document = function(req, res, next) {
  var reUsername = /users\/([\w\d-_]*)\/$/ig;
  options.setParams(req);
  request(options.getDocument(), function(err, responce, body) {
    if (err) console.log(err);
    try {
      var username = reUsername.exec(responce.req.path)[1];
      req.user.updateUsername(username, function(err) {
        if (err) throw err;
      });
    } catch (e) {
      log.error(e);
      log.debug('Необходимо принять соглашения яндекс фоток.');
      req.session.become = 'yandex-terms';
      req.logout();
      return res.redirect('/signup');

    }
    next();
  });
};

exports.new = function(req, res, next) {
  //Если альбом не существует - создаем
  if (!req.track.album.link) {
    createAlbum(req, function(err) {
      if (err) return next(new HttpError(500, 'Извините, произошла ошибка. Мы работаем над исправлением неполадок.'));
    });
  }
  res.render('yandex/upload', {
    title: 'Загрузка фотографий в галерею',
  });
};



/**
 * Загружает фотографии в созданный ранее альбом
 * на Яндекс.Фото
 */

exports.upload = function(req, res, next) {
  var formidable = require('formidable'),
    form = new formidable.IncomingForm(),
    files = [],
    file,
    album_url,
    maxSize = 20971520, // 20 мб.
    count = 0;
  form.multiples = true;
  form.on('file', function(name, file) {
    var type = file.type;
    log.debug('Загрузил фотографию ' + file.name + ' на сервер.');

    /**
     * Валидация загружаемых файлов на стороне сервера.
     * Проверяем размер фотографии и формат файла.
     */

    if (file.size > maxSize) {
      return next(new HttpError(413, 'Допускаются файлы размером не более 20 Мб.'));
    } else if (type != 'image/jpeg' && type != 'image/png' && type != 'image/gif' && type != 'image/bmp') {
      return next(new HttpError(415, 'Неправильный формат файла'));
    } else {
      /**
       * Счетчик, для отслеживания загрузки всех фотографий на Яндекс.Фото.
       */
      count++;
      file = [file.path, file.name, file.type];
      album_url = req.track.album.link;
      uploadPhotos(file);
    }
  });

  form.on('error', function(message) {
    log.debug(message);
    return next(400, message);
  });
  form.parse(req);

  /**
   * Загружает фотографии используя модуль node-formidable.
   * Сначала фотографии загружаеются на сервер, парсятся и отправляются на
   * Яндекс.Фото.
   * В дальнейшей планируется по приложенному маршруту просчитывать
   *  где были сделаны фотографии(по time create) и на этапе парсинга записывать
   *  в EXIF координаты фото.
   * @param  {Array}  ['путь к фото', 'название фото', 'тип фото']
   * @param  {Function} callback
   */

  function uploadPhotos(file, callback) {
    fs.readFile(file[0], function(err, data) {
      if (err) console.log(err);
      options.setParams(req, {
        url: album_url,
        file: file,
        data: data
      });
      // загрузка фотографии на Яндекс.Фото 'POST' запросом.
      request(options.getUpload(), function(err, responce, body) {
        if (err) {
          log.error(err);
          next(500);
          throw err;
        }
        // После завершения загрузки всех фотографий редиректим на страницу
        // с галереей
        if (--count === 0) {
          res.redirect('/track/' + req.track.id + '/gallery');
        }

        log.debug('Завершил загрузку фотографии: ' + file[1]);

        var imageParams;
        try {
          imageParams = JSON.parse(body);
        } catch (e) {
          log.error(body);
        }
        imageParams.title = file[1];
        req.track.addPhoto(imageParams, function(id) {
          var options = new Options();
          options.setParams(req, {
            url: imageParams.links.self
          });
          setTimeout(function() {
            request(options.getGPS(), function(err, response, body) {
              if (err) throw err;
              var geo;
              try {
                geo = (JSON.parse(body)).geo.coordinates;
                req.track.addCoordinates(geo.split(' '), id);
              } catch (e) {
                req.track.addCoordinates(null, id);
              }
            });

          }, 4200);
        });

        /* После загрузки фото удаляет его.
          Можно и не делать, так как удаление файлов в папке /tmp/ происходит
          автоматически. Периодичность зависит от настроек системы.*/
        fs.unlink(file[0], function(err) {
          if (err) log.debug(err);
        });
      });
    });
  }
};

/**
 * Выводит список альбомов пользователя на сервисе Яндекс.Фото
 */

exports.getAlbums = function(req, res, next) {
  options.setParams(req);
  request(options.getAlbum(), function(err, response, body) {
    if (err) log.error(err);
    var albums = [],
      parsedBody;
    //Обработка ошибки, на случай если ядекс будет ругаться и отвечать
    //чем-то вроде этого 'You are not authorized to perform this operation'
    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      log.debug(e);
      return next(new HttpError(500, 'Извините, произошла ошибка. Мы работаем над устранением этой проблемы'));
    }
    parsedBody.entries.forEach(function(album) {
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
    var images_links = [],
      toRemove = [];
    if (track) {
      if (track.images.length === 0) {
        return res.render('yandex/upload', {
          title: 'Загрузка фотографий в галерею',
          success: 'У вас нет загруженых фотографий. Воспользуйтесь формой ниже для загрузки фотографий в галерею.'
        });
      }
      track.images.forEach(function(image, index) {
        if (!image.links.M) {
          try {
            image.links.M = image.links.S;
          } catch (e) {
            log.debug('Картинка очень маленького размера');
            image.links.M = image.links.orig;
          }
        }
        images_links.push({
          links: image.links,
          _id: image._id
        });
      });
      res.render('yandex/gallery', {
        title: 'Галерея',
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
        options.setParams(req, {
          url: removeLink
        });
        request(options.getRemove(), function(err, response, body) {
          req.flash('success', 'Фотография успешно удалена');
          log.debug('Фотография успешно удалена');
        });
      } catch (e) {
        log.debug('Фотография уже удалена, ' + e);
      }
    }
  });

  res.redirect('/track/' + req.track.id + '/gallery');
};

/**
 * Удаляет альбом на Яндекс.Фото
 */

exports.removeAlbum = function(req, res, next) {
  if (req.track.album.self) {
    options.setParams(req, {
      url: req.track.album.self
    });
    request(options.getRemove(), function(err, response, body) {
      log.info('Альбом успешно удален');
    });
    req.flash('success', 'Альбом успешно удален');
    res.redirect('/track/list');
  } else {
    req.flash('success', 'Альбом связанный с Яндекс.Фото не существовал.');
    res.redirect('/track/list');
  }
};
