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
  // fs.mkdir('/tmp/' + req.user.name, function(err) {
  //   if (err) throw err;
  //   fs.mkdir('/tmp/' + req.user.name + '/' + req.track.id, function(err) {
  //     if (err) throw err;
  //   });
  // });
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
  createFolders(userName, trackId, function(err) {
    if (err) throw err;

    var files = [];
    var form = new formidable.IncomingForm();


    form.uploadDir = uploadDir;
    form.multiples = true;
    form.on('file', function(field, file) {
      log.info(field, file.name, file.size);
      files.push(file.name, file.path);
    });
    form.parse(req);
    form.on('error', function(err) {
      return next(err);
    });


    form.on('end', function() {
      track.saveImages(files, function(err) {
        if (err) throw err;

      });
      req.flash('success', 'Фотографии успешно загружены');
      res.render('img/upload', {
        title: 'Загрузка фотографий',
      });
    });


  });

};
