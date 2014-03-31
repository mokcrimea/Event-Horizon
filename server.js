/**
 * Event Horizon
 * (c) M-Team
 */

/**
 * Основные зависимости
 */

var express = require('express'),
  passport = require('passport');

/**
 * Загрузка конфигурации
 */

var config = require('./config'),
  mongoose = require('./lib/mongoose'),
  log = require('./lib/log')(module);


// конфиг passport.js
require('./config/passport')(passport, config);

var app = express();
//настройки express
require('./config/express')(app, config, passport, mongoose);

//роуты
require('./config/routes')(app, passport);

//обработка неперехваченной ошибки
process.on('uncaughtException', function(err) {
  log.error(err.stack);
});


//запуск приложения
port = config.get('port');
app.listen(port);
log.info('Express app started on port ' + port);

exports = module.exports = app;
