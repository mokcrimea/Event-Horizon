var mongoose = require('mongoose'),
  config = require('../config'),
  path = require('path'),
  fs = require('fs');

var connect = function() {
  mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));
};
connect();

mongoose.connection.on('error', function(err) {
  console.log(err);
});

mongoose.connection.on('disconnect', function(){
  console.log('Mongose connection is disconnected');
  connect();
});

var models_path = path.resolve(__dirname, '../models');
fs.readdirSync(models_path).forEach(function(file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
});

module.exports = mongoose;
