/**
 * Controllers
 */

var users = require('../controllers/users'),
  tracks = require('../controllers/tracks'),
  yandex = require('../controllers/yandex'),
  auth = require('../middleware/authorization');


module.exports = function(app, passport) {

  // root route
  app.get('/', tracks.index);

  //user routes
  app.param('uId', users.load);
  app.get('/logout', users.logout);
  app.get('/user/:uId', auth.requireLogin, auth.user, yandex.getAlbums, users.show);
  app.get('/login', passport.authenticate('yandex', {
    failureRedirect: '/login'
  }));
  app.get('/auth/yandex/callback', passport.authenticate('yandex', {
    failureRedirect: '/login'
  }), yandex.document, users.redirect);
  app.get('/signup', users.signup);
  app.get('/track/list', auth.requireLogin, users.list);



  //track routes
  app.param('tId', tracks.load);
  app.get('/upload', auth.requireLogin, tracks.new);
  app.post('/upload', auth.requireLogin, tracks.create);
  app.get('/track/:tId', tracks.show);
  app.delete('/track/:tId', auth.requireLogin, auth.track, tracks.delete, yandex.removeAlbum);

  // gallery routes
  app.get('/track/:tId/galery', yandex.gallery);
  app.delete('/track/:tId/:iId/remove', auth.requireLogin, auth.track, yandex.removePhoto);
  app.get('/track/:tId/yandex', auth.requireLogin, yandex.new);
  app.post('/track/:tId/yandex', auth.requireLogin, auth.track, yandex.upload);

  //все не существующие маршруты отправляем на 404
  app.get(/.*/, function(req, res, next) {
    return next(404);
  });
};
