/**
 * Controllers
 */

var users = require('../controllers/users'),
  tracks = require('../controllers/tracks'),
  auth = require('../middleware/authorization');


module.exports = function(app, passport) {

  // root route
  app.get('/', tracks.index);

  //user routes
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.post('/users', users.create);
  app.get('/logout', users.logout);
  app.get('/user/:id', users.show);
  app.post('/users/session', passport.authenticate('local'), users.session);


  //track routes
  app.get('/upload', auth.requireLogin, tracks.new);
  app.post('/upload', auth.requireLogin, tracks.create);
  app.get('/track/list', auth.requireLogin, users.list);
  app.get('/track/:id', auth.requireLogin, tracks.show);


};
