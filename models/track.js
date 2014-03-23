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
  album: {
    title: String,
    id: String,
    link: String,
    updated: Date,
  },
  images: [{
    links : {},
    param: String,
    self: String,
    id: Schema.ObjectId
  }]
}, {id: true});

/**
 * Methods
 */

TrackSchema.methods = {

  /**
   * Создает новый трек и записывает пользователю ссылку на него (ObjectId)
   *
   * @param {String}   name Название трека
   * @param {Object}   user Создатель
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
   * Записывает данные по альбому в БД
   * @param  {Object}   obj      данные альбома
   * @param  {Function} callback
   */
  createAlbum: function(obj, callback) {
    this.album = {
      title: obj.title,
      id: obj.id,
      link: obj.links.photos,
      updated: obj.updated
    };
    this.save(callback);
  },

  /**
   * Записывает ссылки на загруженные фотографии
   * @param {Object}   obj     Объект ответа от сервера яндекса.
   * @param {Function} callback
   */
  addPhoto: function(obj, callback) {
    this.images.push({links: obj.img, self: obj.links.self, param: obj.id});
    this.save(callback);
  }


};

/**
 * Statics
 */

TrackSchema.statics = {

};


mongoose.model('Track', TrackSchema);
