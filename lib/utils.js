/**
 * Основные зависимости
 */

var fs = require('fs'),
  path = require('path'),
  request = require('request'),
  log = require('../lib/log')(module),
  HttpError = require('../error').HttpError;

/**
 * Формирует объект options для запроса не сервер с
 * помощью request
 * @return {Object}
 */

function Options() {
  var request = {},
    params = {},
    options = {},
    username;

  this.setParams = function(req, parameters) {
    username = req.user.username;
    params = parameters;
    options = {
      url: '',
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;type=entry',
        Authorization: 'OAuth ' + req.user.authToken
      }
    };
  };

  this.getDocument = function() {
    request.document = options;
    request.document.url = 'http://api-fotki.yandex.ru/api/me/';
    return request.document;
  };

  this.getCreate = function() {
    request.create = options;
    request.create.method = 'POST';
    request.create.url = 'http://api-fotki.yandex.ru/api/users/' + username + '/albums/';
    request.create.body = options.body = JSON.stringify({
      title: new Date().toJSON().substr(0, 19)
    });
    return request.create;
  };


  this.getUpload = function() {
    request.upload = options;
    request.upload.method = 'POST';
    request.upload.url = params.url;
    request.upload.headers['Content-type'] = params.file[2];
    request.upload.body = params.data;
    return request.upload;
  };


  this.getGPS = function() {
    request.gps = options;
    request.gps.url = params.url;
    return request.gps;
  };


  this.getAlbum = function() {
    request.album = options;
    request.album.url = 'http://api-fotki.yandex.ru/api/users/' + username + '/albums/';
    return request.album;
  };

  this.getRemove = function() {
    request.removePhoto = options;
    request.removePhoto.url = params.url;
    request.removePhoto.method = 'DELETE';
    /*    delete request.removePhoto.headers.Accept;
    delete request.removePhoto.headers['Content-Type'];*/
    return request.removePhoto;
  };
}

exports.Options = Options;

/**
 * Создает альбом с названием в виде: "2014-03-22T14:08:20"
 * @param  {Function} callback
 */
exports.createAlbum = function(req, callback) {
  var options = new Options();
  options.setParams(req);
  request(options.getCreate(), function(err, responce, body) {
    if (err) {
      log.error(err);
      next(500);
      throw err;
    }
    try {
      req.track.addAlbum(JSON.parse(body), function(err) {
        log.info('Альбом успешно создан');
        if (err) log.error(err);
      });
    } catch (e) {
      log.error(e);
      return callback(500);
    }
  });
};

/**
 * Создает папку с треком в root_folder/tracks/
 * @param  {String}   id       идентификатор трека
 * @param  {Function} callback
 */
exports.createFolders = function(id, callback) {
  trackFolder = getTracksPath() + id;
  fs.exists(trackFolder, function(exists) {
    if (!exists) {
      fs.mkdirSync(trackFolder);
      callback(null);
    }
  });
};

function getRootPath() {
  return path.normalize(__dirname + '/..');
}

exports.getRootPath = getRootPath;

function getTracksPath() {
  return path.normalize(__dirname + '/..') + '/tracks/';
}

exports.getTracksPath = getTracksPath;
