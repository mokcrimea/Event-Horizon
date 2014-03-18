/**
 * Controllers
 */

var users = require('../controllers/users'),
  tracks = require('../controllers/tracks'),
  images = require('../controllers/images'),
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
  app.post('/user/session', passport.authenticate('local'), users.session);
  // app.put('/user/:uId', auth.requireLogin, auth.user, users.update);

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
  app.post('/track/:tId/img', auth.requireLogin, auth.img, images.create);

  //non-exists routes
  app.get(/.*/, function(req, res, next) {
    return next(404);
  });
};
