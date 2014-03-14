var mongoose = require('mongoose');
var config = require('config');
var path = require('path');
var fs = require('fs');

var connect = function() {
  mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));
};
connect();

mongoose.connection.on('error', function(err) {
  console.log(err);
});

var models_path = path.resolve(__dirname, '../models');
fs.readdirSync(models_path).forEach(function(file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
});

module.exports = mongoose;
