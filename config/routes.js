/**
 * Controllers
 */

var users = require('../controllers/users'),
  tracks = require('../controllers/tracks'),
  // images = require('../controllers/images'),
  yandex = require('../controllers/yandex'),
  auth = require('../middleware/authorization');


module.exports = function(app, passport) {

  // root route
  app.get('/', tracks.index);

  //user routes
  app.param('uId', users.load);
  // app.get('/login', users.login);
  // app.get('/signup', users.signup);
  // app.post('/user', users.create);
  app.get('/logout', users.logout);
  app.get('/user/:uId', users.show);
  app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Неправильное имя пользователя или пароль'
  }), users.session);
  app.get('/login', passport.authenticate('yandex', {
    failureRedirect: '/login'
  }));
  app.get('/auth/yandex/callback', passport.authenticate('yandex', {
    failureRedirect: '/login'
  }), yandex.document, users.session);
  // app.put('/user/:uId', auth.requireLogin, auth.user, users.update);

  // yandex fotki
  // app.get('/yandex/create', auth.requireLogin, yandex.createAlbum);
  // app.get('/yandex/albums', auth.requireLogin, yandex.getAlbums);
  app.get('/track/:tId/galery', yandex.show);
  app.delete('/track/:tId/:iId/remove', auth.requireLogin, auth.track, yandex.deleteImage);
  app.get('/track/:tId/:iId/show', auth.requireLogin, auth.track, yandex.showInfo);
  app.get('/track/:tId/yandex', auth.requireLogin, yandex.new);
  app.post('/track/:tId/yandex', auth.requireLogin, auth.track, yandex.createAndUpload, yandex.updateGeoTags);


  //track routes
  app.param('tId', tracks.load);
  app.get('/upload', auth.requireLogin, tracks.new);
  app.post('/upload', auth.requireLogin, tracks.create);
  app.get('/track/list', auth.requireLogin, users.list);
  app.get('/track/:tId', auth.requireLogin, tracks.show);
  // app.put('/track/:tId', auth.requireLogin, auth.track , tracks.update);
  // app.del('/track/:tId', auth.requireLogin, auth.track , tracks.delete);


  //non-exists routes
  app.get(/.*/, function(req, res, next) {
    return next(404);
  });
};
