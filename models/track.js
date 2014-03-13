var crypto = require('crypto');
var async = require('async');
var util = require('util');


var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var trackSchema = new Schema({
  _creator: {type : Schema.ObjectId, ref : 'User'},
  created: {type: Date, default: Date.now},
  track: {type: Object, required: true}
});

trackSchema.virtual('showId').get(function() {
  return this._id;
});

trackSchema.statics.showUserId = function(user) {
  var theOne = mongoose.models.User(user);
  return theOne.showId;

};

trackSchema.methods.addTrack = function(user, track, callback) {
  console.log(this);
  this.push({
    _creator: user._id,
    track: track
  });

  this.save(callback);
};

exports.Track = mongoose.model('Track', trackSchema);
