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
  inform: {
    distance: Number,
    time: String,
    center: Array
  },
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
    title: String,
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
   * @param {Object}   inform Информация о маршруте
   * @param {Function} callback
   */

  create: function(name, user, inform, callback) {
    var id = user._id;
    var that = this;
    this.name = name;
    this._creator = id;
    this.inform = {
      center: inform.center,
      distance: inform.distance,
      time: inform.time || undefined
    };
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
  addAlbum: function(obj, callback) {
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
      title: obj.title,
      created: obj.created,
      self: obj.links.self,
      param: obj.id
    });
    this.save(function(err, track) {
      if (err) console.log(err);
      callback(track.images[track.images.length - 1]._id);
    });
  },

  /**
   * Добавляет координаты изображения если они есть, в
   * противном случае записыват null.
   * @param {Array || null}   coord
   * @param {Number}   id
   */
  addCoordinates: function(coord, id) {
    mongoose.model('Track').findById(this.id, 'images', function(err, track) {
      if (err) console.log(err);
      image = track.images.id(id);

      if (image) {
        if (coord !== null) {
          var x = parseFloat(coord[0]);
          var y = parseFloat(coord[1]);
          image.coordinates.push([x, y]);
        } else {
          image.coordinates.push(null);
        }
        track.save(function(err){
          if (err) console.log(err);
        });
      }
    });
  }


};

TrackSchema.statics = {

  /**
   * Находит треки созданные пользователем
   * @param  {ObjectId}   id
   * @param  {Function} callback
   */

  list: function(id, callback) {
    this.findOne({
      _id: id
    }).populate('_creator', 'name id distance').exec(callback);
  }
};

mongoose.model('Track', TrackSchema);
