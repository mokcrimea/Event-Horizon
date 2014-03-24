var mongoose = require('lib/mongoose');
var async = require('async');

async.series([
  open,
  dropDatabase
], function(err) {
  console.log(arguments);
  mongoose.disconnect();
  process.exit(err ? 255 : 0);
});

function open(callback) {
  mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
  var db = mongoose.connection.db;
  db.dropDatabase(callback);
}
