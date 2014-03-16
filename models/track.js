/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TrackSchema = new Schema({
  name: { type: String},
  _creator: { type : Schema.ObjectId, ref : 'User'},
  created: { type: Date, default: Date.now},
  track: { type: Schema.Types.Mixed, required: true},
  time: { type: Array, required: true}
});

TrackSchema.virtual('showId').get(function() {
  return this._id;
});

/**
 * Methods
 */

TrackSchema.methods = {

  /**
   * Add a new track
   *
   * @param {String}   name
   * @param {Object}   user
   * @param {Object}   track
   * @param {Function} callback
   */

  addTrack: function(name, user, track, time, callback) {
    var id = user._id;
    this.name = name;
    this._creator = id;
    this.track = track;
    this.time = time;
    this.save(callback);

    user.tracks.push(this.id);
    user.save(callback);

  }

};

/**
 * Statics
 */

TrackSchema.statics = {

};


mongoose.model('Track', TrackSchema);
