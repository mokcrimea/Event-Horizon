/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Track = mongoose.model('Track'),
  fs = require("fs"),
  HttpError = require('../error').HttpError,
  path = require('path'),
  createFolders = require('../lib/createUserFolder'),
  log = require('../lib/log')(module);

/**
 * Load the track creator
 */

exports.load = function(req, res, next, id) {
  var trackPath = '/tmp/' + id + '/track';
  Track.findById(id, 'name _creator created images album', function(err, track) {
    if (err) return next(404, err);
    if (track) {
      req.track = track;
      fs.readFile(trackPath, function(err, data) {
        if (err) return next(404, err);
        req.track.track = data;
        next();
      });
    } else {
      next(new HttpError(404, 'Трек не существует'));
    }
  });
};

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
  var track = req.track;
  res.render('track/show', {
    title: track.name,
    coord: track.track,
    track: track
  });
};

/**
 * Create a new track
 */

exports.create = function(req, res) {
  var formidable = require('formidable');
  var parseTrack = require('../lib/parseTrack');
  var track = new Track({});
  var username = req.user.username;
  var trackId = track.id;
  var uploadDir = '/tmp/' + trackId;
  var form = new formidable.IncomingForm();
  // form.uploadDir = uploadDir;
  createFolders(trackId, function(err) {
    if (err) throw err;

    form.parse(req, function(error, fields, files) {

      fs.readFile(files.upload.path, function(err, Data) {
        if (err) throw err;

        parseTrack(Data, uploadDir, function(err) {
          if (err) throw err;
          fs.unlink(files.upload.path, function(err) {
            if (err) throw err;
          });

          track.create(fields.title, req.user, function(err) {

            if (err) throw err;
            log.info('The track succesfully created');
            req.flash('success', 'Трек успешно загружен');
            res.redirect('/track/' + track.id);
          });
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
