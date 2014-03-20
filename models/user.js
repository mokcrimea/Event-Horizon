/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  crypto = require('crypto'),
  async = require('async'),
  util = require('util'),
  Schema = mongoose.Schema;

/**
 * User Schema
 */

var UserSchema = new Schema({
  name: { type: String},
  email: { type: String},
  username: { type: String},
  hashedPassword: { type: String},
  provider: {type: String},
  authToken: { type: String},
  albums: [{
    title: String,
    id: String,
    link: String,
    updated: Date
  }],
  created: { type: Date, default: Date.now},
  tracks: [{ type: Schema.ObjectId, ref: 'Track'}],
  yandex: { type: Object}
});

/**
 * Virtuals
 */

UserSchema.virtual('showId').get(function() {
  return this._id;
});

UserSchema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._plainPassword;
  });

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Encrypt password
   * @param  {String} password
   * @return {String}
   */

  encryptPassword: function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  },

  /**
   * Check the passwords
   * @param  {String} password
   * @return {Boolean}
   */

  checkPassword: function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
  },

  setToken: function(token, callback) {
    this.authToken = token;
    this.save(callback);
  },

  updateUsername: function(username, callback) {
    this.username = username;
    this.save(callback);
  },

  createAlbum: function(obj, callback) {
    this.albums.push({
      title: obj.title,
      id: obj.id,
      link: obj.links.photos,
      updated: obj.updated
    });
    this.save(callback);
  }

};

UserSchema.statics = {

  /**
   * Find tracks created by user
   * @param  {ObjectId}   id
   * @param  {Function} callback
   */

  list: function(id, callback) {
    this.findOne({
      _id: id
    }).populate('tracks', 'name id').exec(callback);
  }
};


mongoose.model('User', UserSchema);
