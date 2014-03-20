/**
 * Controllers
 */

var users = require('../controllers/users'),
  tracks = require('../controllers/tracks'),
  images = require('../controllers/images'),
  yandex = require('../controllers/yandex'),
  auth = require('../middleware/authorization');


module.exports = function(app, passport) {

  // root route
  app.get('/', tracks.index);

  //user routes
  app.param('uId', users.load);
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.post('/user', users.create);
  app.get('/logout', users.logout);
  app.get('/user/:uId', users.show);
  app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Неправильное имя пользователя или пароль'
  }), users.session);
  app.get('/auth/yandex', passport.authenticate('yandex', {
    failureRedirect: '/login'
  }));
  app.get('/auth/yandex/callback', passport.authenticate('yandex', {
    failureRedirect: '/login'
  }), yandex.document);
  // app.put('/user/:uId', auth.requireLogin, auth.user, users.update);

  // yandex fotki
  app.get('/yandex/create', auth.requireLogin, yandex.createAlbum);
  app.get('/yandex/albums', auth.requireLogin, yandex.getAlbums);
  app.post('/img/:tId/yandex', auth.requireLogin, auth.img, yandex.upload);


  //track routes
  app.param('tId', tracks.load);
  app.get('/upload', auth.requireLogin, tracks.new);
  app.post('/upload', auth.requireLogin, tracks.create);
  app.get('/track/list', auth.requireLogin, users.list);
  app.get('/track/:tId', auth.requireLogin, tracks.show);
  // app.put('/track/:tId', auth.requireLogin, auth.track , tracks.update);
  // app.del('/track/:tId', auth.requireLogin, auth.track , tracks.delete);

  //upload pictures to the track
  app.get('/track/:tId/img', auth.requireLogin, auth.img, images.new);
  app.post('/img/:tId', auth.requireLogin, auth.img, images.create);

  //non-exists routes
  app.get(/.*/, function(req, res, next) {
    return next(404);
  });
};
