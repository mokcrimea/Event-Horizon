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
  username: { type: String, unique: true, required: true},
  hashedPassword: { type: String, required: true},
  provider: {type: String},
  salt: { type: String, required: true},
  created: { type: Date, default: Date.now},
  tracks: [{ type: Schema.ObjectId, ref: 'Track'}]
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
  encryptPassword: function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  },

  checkPassword: function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
  }


};


mongoose.model('User', UserSchema);


function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);

  this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;
