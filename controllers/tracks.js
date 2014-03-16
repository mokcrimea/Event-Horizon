/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Track = mongoose.model('Track'),
  fs = require("fs"),
  log = require('../lib/log')(module);

/**
 * Index
 */

exports.index = function(req, res) {
  res.render('index', {
    title: 'Главная'
  });
};

/**
 * Upload
 */

exports.new = function(req, res) {
  res.render('track/upload', {
    title: 'Загрузка нового трека',
  });
};

/**
 * Show a track
 */

exports.show = function(req, res, next) {
  Track.findById(req.params.id, function(err, track) {
    if (err) return next(err);
    if (!track) {
      log.debug('Track not found');
      return next(new HttpError(404, 'Track not found'));
    }
    res.render('track/show', {
      title: track.name,
      coord: track.track
    });
  });
};

/**
 * Create a new track
 */

exports.create = function(req, res) {
  var formidable = require('formidable');
  var form = new formidable.IncomingForm();
  var parseTrack = require('../middleware/parseTrack');
  var track = new Track({});

  form.parse(req, function(error, fields, files) {
    fs.readFile(files.upload.path, function(err, Data) {
      if (err) throw err;
      parseTrack.parse(Data, function(parsedCoord, parsedTime) {
        track.create(fields.title, req.user, parsedCoord, parsedTime, function(err) {
          if (err) throw err;
          log.info('The track succesdully created');
          req.flash('success', 'Трек успешно загружен');
          res.redirect('/track/' + track.id);
        });
      });
    });
  });
};

/**
 * Edit a track
 */

exports.edit = function(req, res) {

};

/**
 * Update a track
 */

exports.update = function(req, res) {

};

/**
 * Delete a track
 */

exports.delete = function(req, res) {

};
