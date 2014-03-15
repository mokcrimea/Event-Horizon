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
 * List of tracks
 */

exports.list = function(req, res) {
  Track.list(req.user, function(err, user) {
    var tracks = user.tracks;
    res.render('track/list', {
      title: 'Tracks',
      tracks: tracks
    });
  });
};

/**
 * Show a track
 */

exports.show = function(req, res) {
  Track.findById(req.params.id, function(err, track) {
    console.log(track);
    res.render('track/show', {
      title: track.name,
      track: track.track
    });
  });
};

/**
 * Create a track
 */

exports.create = function(req, res, next) {
  var formidable = require('formidable');
  var libxmljs = require("libxmljs");
  var track = new Track({});

  var form = new formidable.IncomingForm();
  form.parse(req, function(error, fields, files) {
    fs.rename(files.upload.path, "/tmp/test.gpx", function(err) {
      if (err) throw err;
    });
    fs.readFile('/tmp/test.gpx', function(err, logData) {
      if (err) throw err;
      var xmlTrack = logData.toString(),
        positionGpx = xmlTrack.indexOf('<metadata>');
      // Убираем из gps трека некорретные для модуля аттрибуты тега
      xmlTrack = '<?xml version="1.0" encoding="utf-8"?>\n<gpx>\n' + xmlTrack.substr(positionGpx);

      var xmlDoc = libxmljs.parseXml(xmlTrack),
        coordinateData = xmlDoc.child(3).child(1).childNodes(),
        coordinateX, coordinateY, timeCreate, timeFormated;
      var trackObj = {};

      for (var i = 1; i < coordinateData.length; i += 2) {
        coordinateX = coordinateData[i].attr('lat').value();
        coordinateY = coordinateData[i].attr('lon').value();
        timeCreate = new Date(coordinateData[i].child(3).text());
        timeFormated = timeCreate.getHours() + ':' + timeCreate.getMinutes();
        trackObj[timeFormated] = [coordinateX, coordinateY];
      }
      //add new track to the db.tracks & the track._id to db.users.tracks
      track.addTrack('ATATATATATA', req.user, trackObj, function(err) {
        if (err) return next(err);
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
