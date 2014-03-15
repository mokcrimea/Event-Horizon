/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TrackSchema = new Schema({
  name: { type: String},
  _creator: { type : Schema.ObjectId, ref : 'User'},
  created: { type: Date, default: Date.now},
  track: { type: Object, unique: true}
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

  addTrack: function(name, user, track, callback) {
    var id = user._id;
    this.name = name;
    this._creator = id;
    this.track = track;
    this.save(callback);

    user.tracks.push(this.id);
    user.save(callback);

  }

};

/**
 * Statics
 */

TrackSchema.statics = {

  list: function(user, callback) {
    User = mongoose.model('User');
    var id = user.id;
    User.findOne({_id: id}).populate('tracks', 'name id').exec(callback);
  }

};


mongoose.model('Track', TrackSchema);
