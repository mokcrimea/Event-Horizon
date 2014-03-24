/**
 * Module dependencies.
 */

var express = require('express'),
  MongoStore = require('connect-mongo')(express),
  log = require('../lib/log')(module),
  path = require('path'),
  helpers = require('view-helpers'),
  flash = require('connect-flash'),
  HttpError = require('../error').HttpError;


module.exports = function(app, config, passport, mongoose) {

  app.use(express.compress({
    filter: function(req, res) {
      return /json|text|css|javascript/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }));


  app.use(express.favicon(path.join(path.resolve(__dirname, '../public/img/favicon.ico'))));
  app.use(express.static(path.join(path.resolve(__dirname, '../public'))));


  app.set('views', path.resolve(__dirname, '../template'));
  app.set('view engine', 'jade');

  // Логирование
  if (app.get('env') == 'development') {
    app.use(express.logger('dev'));
  } else {
    app.use(express.logger('default'));
  }

  app.configure(function() {

    app.use(express.cookieParser());

    app.use(require('../middleware/sendHttpError'));


    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.methodOverride());

    //mongo-session setting
    app.use(express.session({
      secret: config.get('session:secret'),
      key: config.get('session:key'),
      cookie: config.get('session:cookie'),
      store: new MongoStore({
        mongoose_connection: mongoose.connection
      })
    }));

    app.use(passport.initialize());
    app.use(passport.session());


    app.use(flash());

    //should be after session
    //provides helper methods to the views
    app.use(helpers(require('../package.json').name));


    var csrfValue = function(req) {
      var token = (req.headers['x-csrf-token']) || (req.headers['x-xsrf-token']) || (req.cookies['X-CSRF-Token']);
      return token;
    };

    var csrfToCookie = function(req, res, next) {
      res.cookie('X-CSRF-Token', req.csrfToken());
      next();
    };
    app.use(express.csrf({
      value: csrfValue
    }));
    app.use(csrfToCookie);

    // должно быть последним
    app.use(app.router);

    // обрабокта ошибок
    app.use(function(err, req, res, next) {
      if (typeof err == 'number') { // next(404);
        err = new HttpError(err);
      }

      if (err instanceof HttpError) {
        res.sendHttpError(err);
      } else {
        if (app.get('env') == 'development') {
          express.errorHandler()(err, req, res, next);
        } else {
          log.error(err);
          err = new HttpError(500);
          res.sendHttpError(err);
        }
      }
    });

  });

  // красивое отображение html кода
  app.configure('development', function() {
    app.locals.pretty = true;
  });

};
