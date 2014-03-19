/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  fs = require("fs"),
  formidable = require('formidable'),
  path = require('path'),
  createFolders = require('../lib/createUserFolder'),
  log = require('../lib/log')(module);

/**
 * Image upload
 */

exports.new = function(req, res) {
  var userName = req.user.name;
  var trackId = req.track.id;
  createFolders(userName, trackId, function(err) {
    if (err) throw err;
  });
  res.render('img/upload', {
    title: 'Загрузка фотографий'
  });
};

/**
 * Images create
 */

exports.create = function(req, res, next) {
  var userName = req.user.name;
  var track = req.track;
  var trackId = track.id;
  var uploadDir = '/tmp/' + userName + '/' + trackId;
  var message;

  var files = [];
  var form = new formidable.IncomingForm();


  form.uploadDir = uploadDir;
  form.multiples = true;
  form.on('file', function(field, file) {
    log.info(field, file.name, file.size);
    files.push([file.name, file.path]);
    if (files.length == 1) {
      message = 'Фотография успешно загружена';
    } else {
      message = 'Фотографии успешно загружены';
    }
  });
  form.parse(req);
  form.on('error', function(err) {
    return next(err);
  });
  form.on('end', function() {
    track.saveImages(files, function(err) {
      if (err) throw err;
    });
    res.render('img/upload', {
      title: 'Загрузка фотографий',
      success: message
    });
  });


};

/**
 * Show a gallery of images
 */