/**
 * Controllers
 */

var users = require('../controllers/users'),
  tracks = require('../controllers/tracks'),
  auth = require('../middleware/authorization');

localReq = function(req, res, next) {
  res.locals.req = req;
  next();
};


module.exports = function(app, passport) {

  // root route
  app.get('/', localReq, tracks.index);

  //user routes
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.post('/users', users.create);
  app.get('/logout', users.logout);
  app.post('/users/session', passport.authenticate('local'), users.session);


  //track routes
  app.get('/upload', auth.requireLogin, tracks.upload);
  app.post('/upload', auth.requireLogin, tracks.create);
  app.get('/show', auth.requireLogin, tracks.show);


};
