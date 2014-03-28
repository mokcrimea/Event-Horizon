/**
 * Основные зависимости
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Схема трека
 */

var TrackSchema = new Schema({
  name: { type: String, require: true},
  _creator: { type : Schema.ObjectId, ref : 'User'},
  created: { type: Date, default: Date.now},
  distance: Number,
  album: {
    title: String,
    id: String,
    link: String,
    self: String,
    updated: Date,
  },
  images: [{
    links : {},
    param: String,
    self: String,
    coordinates: [],
    created: Date,
    id: Schema.ObjectId
  }]
});

/**
 * Методы
 */

TrackSchema.methods = {

  /**
   * Создает новый трек и записывает пользователю ссылку на него (ObjectId)
   *
   * @param {String}   name Название трека
   * @param {Object}   user Создатель
   * @param {Number}   distance Длина маршрута
   * @param {Function} callback
   */

  create: function(name, user, distance, callback) {
    var id = user._id;
    var that = this;
    this.name = name;
    this._creator = id;
    this.distance = distance;
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
      self: obj.links.self,
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
    var that = this;
    this.images.push({
      links: {
        M: obj.img.M,
        L: obj.img.L,
        S: obj.img.S,
        orig: obj.img.orig
      },
      created: obj.created,
      self: obj.links.self,
      param: obj.id
    });
    this.save(function(err, index) {
      if (err) console.log(err);
      callback(that.images.length - 1);
    });
  },

  /**
   * Добавляет координаты изображения если они есть, в
   * противном случае записыват null.
   * @param {Array || null}   coord
   * @param {Number}   index    Номер фотографии
   * @param {Function} callback
   */
  addCoordinates: function(coord, index, callback) {
    if (coord !== null) {
      var x = parseFloat(coord[0]);
      var y = parseFloat(coord[1]);
      this.images[index].coordinates.push([x, y]);
    } else {
      this.images[index].coordinates.push(null);
    }
    this.save(callback);
  }


};

/**
 * Statics
 */

TrackSchema.statics = {

};


mongoose.model('Track', TrackSchema);
