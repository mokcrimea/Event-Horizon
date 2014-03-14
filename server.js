/**
 * GPS Fixer
 * (c) M-Team
 */

/**
 * Module dependencies.
 */

var express = require('express'),
  fs = require('fs'),
  passport = require('passport');

/**
 * Load configuration
 */

var config = require('./config'),
  mongoose = require('./lib/mongoose'),
  log = require('./lib/log')(module);


// passport config
require('./config/passport')(passport, config);

var app = express();
//express setting
require('./config/express')(app, config, passport, mongoose);

//routes
require('./config/routes')(app, passport);

//start the app
port = config.get('port');
app.listen(port);
log.info('Express app started on port ' + port);

exports = module.exports = app;