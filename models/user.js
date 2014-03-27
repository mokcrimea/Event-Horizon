/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  crypto = require('crypto'),
  async = require('async'),
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
   * Зашифровывает пароль
   * @param  {String} password
   * @return {String}
   */

  encryptPassword: function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  },

  /**
   * Проверяет правильный ли пароль
   * @param  {String} password
   * @return {Boolean}
   */

  checkPassword: function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
  },

  /**
   * Записывает AuthToken пользователя
   * @param {String}   token
   * @param {Function} callback
   */
  setToken: function(token, callback) {
    this.authToken = token;
    this.save(callback);
  },

  /**
   * Обновляет поле username в документе пользователя
   * @param  {String}   username
   * @param  {Function} callback
   */
  updateUsername: function(username, callback) {
    this.username = username;
    this.save(callback);
  }

};

UserSchema.statics = {

  /**
   * Находит треки созданные пользователем
   * @param  {ObjectId}   id
   * @param  {Function} callback
   */

  list: function(id, callback) {
    this.findOne({
      _id: id
    }).populate('tracks', 'name id distance').exec(callback);
  }
};


mongoose.model('User', UserSchema);
