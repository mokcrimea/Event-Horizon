/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Track Schema
 */

var TrackSchema = new Schema({
  name: { type: String},
  _creator: { type : Schema.ObjectId, ref : 'User'},
  created: { type: Date, default: Date.now},
  images: { type: Array},
  track: { type: Array, required: true}
});

/**
 * Virtuals
 */

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
   * @param {Function} callback
   */

  create: function(name, user, callback) {
    var id = user._id;
    var that = this;
    this.name = name;
    this._creator = id;
    this.save(function(err) {
      if (err) throw err;
      user.tracks.push(that.id);
      user.save(function(err) {
        if (err) throw err;
      });
    });
    return callback(undefined);
  },

  /**
   * Save images paths into DB
   * @param  {Array}   files
   * @param  {Function} callback
   */
  saveImages: function(files, callback) {
    var that = this;
    files.forEach(function(el) {
      that.images.push(el);
    });
    this.save(callback);
  }

};

/**
 * Statics
 */

TrackSchema.statics = {

};


mongoose.model('Track', TrackSchema);
