/**
 * Controllers
 */

var users = require('../controllers/users'),
  tracks = require('../controllers/tracks'),
  checkAuth = require('middleware/checkAuth');
module.exports = function(app) {

  // root route
  app.get('/', tracks.index);

  //user routes
  app.get('/login', users.login);
  app.post('/login', users.create);
  app.post('/logout', users.logout);


  //track routes
  app.get('/upload', checkAuth, tracks.upload);
  app.post('/upload', checkAuth, tracks.create);
  app.get('/show', tracks.show); //after uploading redirect to the /show page


};
