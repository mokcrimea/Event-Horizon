/**
 * Основные зависимости
 */

var fs = require("fs");

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
exports.set_Options = function(req, type, params) {
  var options = {
    url: '',
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;type=entry',
      Authorization: 'OAuth ' + req.user.authToken
    }
  };

  switch (type) {
    case 'document':
      options.url = 'http://api-fotki.yandex.ru/api/me/';
      return options;
    case 'create':
      var title = new Date().toJSON().substr(0, 19);
      options.method = 'POST';
      options.url = 'http://api-fotki.yandex.ru/api/users/' + req.user.username + '/albums/';
      options.body = JSON.stringify({
        title: title
      });
      return options;
    case 'upload':
      options.method = 'POST';
      options.url = params.url;
      options.headers['Content-type'] = params.file[2];
      options.body = params.data;
      return options;
    case 'getGPS':
      options.url = params.url;
      return options;
    case 'album':
      options.url = 'http://api-fotki.yandex.ru/api/users/' + req.user.username + '/albums/';
      return options;

  }
};
