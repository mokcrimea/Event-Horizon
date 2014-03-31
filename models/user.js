/**
 * Основные зависимости
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Схема пользователя
 */

var UserSchema = new Schema({
  name: { type: String},
  email: { type: String},
  username: { type: String},
  provider: {type: String},
  authToken: { type: String},
  created: { type: Date, default: Date.now},
  tracks: [{ type: Schema.ObjectId, ref: 'Track'}],
  yandex: { type: Object}
});

/**
 * Mетоды
 */

UserSchema.methods = {

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
    }).populate('tracks', 'name id inform').exec(callback);
  }
};


mongoose.model('User', UserSchema);
