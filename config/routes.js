/**
 * Controllers
 */

var users = require('../controllers/users'),
  tracks = require('../controllers/tracks'),
  ya_photo = require('../controllers/yandex-photo'),
  auth = require('../middleware/authorization');

var trackOwner = [auth.requireLogin, auth.track];

module.exports = function(app, passport) {

  // root route
  app.get('/', tracks.index);

  //user routes
  app.param('uId', users.load);
  app.get('/logout', users.logout);
  app.get('/user/:uId', auth.requireLogin, auth.user, ya_photo.getAlbums, users.show);
  app.get('/login', passport.authenticate('yandex', {
    failureRedirect: '/login'
  }));
  app.get('/auth/yandex/callback', passport.authenticate('yandex', {
    failureRedirect: '/login'
  }), ya_photo.document, users.redirect);
  app.get('/signup', users.signup);
  app.get('/track/list', auth.requireLogin, users.list);



  //track routes
  app.param('tId', tracks.load);
  app.get('/upload', auth.requireLogin, tracks.new);
  app.post('/upload', auth.requireLogin, tracks.create);
  app.get('/track/:tId', tracks.show);
  app.delete('/track/:tId', trackOwner, tracks.delete, ya_photo.removeAlbum);

  // gallery routes
  app.get('/track/:tId/gallery', ya_photo.gallery);
  app.delete('/track/:tId/:iId/remove', trackOwner, ya_photo.removePhoto);
  app.get('/track/:tId/yandex', auth.requireLogin, ya_photo.new);
  app.post('/track/:tId/yandex', trackOwner, ya_photo.upload);

  //все не существующие маршруты отправляем на 404
  app.get(/.*/, function(req, res, next) {
    return next(404);
  });
};
