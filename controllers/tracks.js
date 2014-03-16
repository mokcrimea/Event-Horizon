/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Track = mongoose.model('Track'),
  fs = require("fs");

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
  res.render('upload', {
    title: 'Загрузка нового трека',
  });
};

/**
 * Show a track
 */

exports.show = function(req, res) {
  Track.findById(req.params.id, function(err, track) {
    if (err) console.log('Track does not exists');
    res.render('track/show', {
      title: track.name,
      coord: track.track,
    });
  });
};

/**
 * Create a new track
 */

exports.create = function(req, res, next) {
  var formidable = require('formidable');
  var form = new formidable.IncomingForm();
  var parseTrack = require('../middleware/parseTrack');
  var newTrack = new Track({});

  form.parse(req, function(error, fields, files) {
    fs.readFile(files.upload.path, function(err, Data) {
      if (err) throw err;
      parseTrack.parse(Data, function(parsedCoord, parsedTime) {
        newTrack.addTrack(fields.title, req.user, parsedCoord, parsedTime, function(err) {
          if (err) next(err);
        });
      });
    });
  });
  res.render('upload', {
    title: 'Upload succsesfull!'
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
