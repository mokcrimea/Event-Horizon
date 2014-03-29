/**
 * Основные зависимости
 */

var fs = require("fs"),
  request = require('request'),
  log = require('../lib/log')(module);

/**
 * Возвращает дату в формате D.M.Y H:M
 * @param  {String} date
 * @return {String}
 */
exports.formatDate = function(date) {
  var year = date.getFullYear().toString().substr(2);
  var month = date.getMonth();
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
};

/**
 * Формирует объект options для запроса не сервер с
 * помощью request
 * @param {Object} req
 * @param {String} type
 * @param {Object} params
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
exports.createAlbum = function(req) {
  var options = new Options();
  options.setParams(req);
  request(options.getCreate(), function(err, responce, body) {
    if (err) {
      log.error(err);
      next(500);
      throw err;
    }
    req.track.addAlbum(JSON.parse(body), function(err) {
      log.info('Альбом успешно создан');
      if (err) throw err;
    });
  });
};
