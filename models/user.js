/**
 * Module dependencies.
 */

var crypto = require('crypto');
var async = require('async');
var util = require('util');

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * User Schema
 */

var userSchema = new Schema({
  email: { type: String, default: '' },
  username: { type: String, unique: true, required: true},
  hashedPassword: { type: String, required: true},
  salt: { type: String, required: true},
  created: { type: Date, default: Date.now},
  tracks: [{ type: Schema.ObjectId, ref: 'Track'}]
});

/**
 * Virtuals
 */

userSchema.virtual('showId').get(function() {
  return this._id;
});

userSchema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });

/**
 * Methods
 */

userSchema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

userSchema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

userSchema.statics.authorize = function(username, password, callback) {
  var User = this;

  async.waterfall([
    function(callback) {
      User.findOne({username: username}, callback);
    },
    function(user, callback) {
      if (user) {
        if (user.checkPassword(password)) {
          callback(null, user);
        } else {
          callback(new AuthError("Пароль неверен"));
        }
      } else {
        var user = new User({username: username, password: password});
        user.save(function(err) {
          if (err) return callback(err);
          callback(null, user);
        });
      }
    }
  ], callback);
};

mongoose.model('User', userSchema);


function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);

  this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;
