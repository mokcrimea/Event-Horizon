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

exports.upload = function(req, res) {
  res.render('upload');
};

/**
 * Show a track
 */

exports.show = function(req, res) {

  console.log("The 'show' route was called.");

  fs.readFile("/tmp/test.png", "binary", function(error, file) {

    if (error) {
      res.writeHead(500, {"Content-Type": "text/plain"});
      res.write(error + "\n");
      res.end();
    } else {
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.write(file, "binary");
      res.end();
    }
  });

};

/**
 * Create a track
 */

exports.create = function(req, res) {
  var formidable = require('formidable');

  console.log("The 'upload' route was called.");

  var form = new formidable.IncomingForm();
  console.log("Start parsing");
  form.parse(req, function(error, fields, files) {
    console.log("parsing");

    fs.rename(files.upload.path, "/tmp/test.png", function(err) {
      if (err) throw err;
    });
    res.writeHead(200, {
      "Content-Type": "text/html"
    });
    res.write("received image:<br/>");
    res.write("<img src='/show' />");
    res.end();
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
