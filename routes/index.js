var checkAuth = require('middleware/checkAuth');

module.exports = function(app) {

  app.get('/', require('./frontpage').get);

  app.get('/upload', checkAuth, require('./upload').get);
  app.post('/upload', checkAuth, require('./upload').post);

  app.get('/show', require('./show').get);

  app.get('/login', require('./login').get);
  app.post('/login', require('./login').post);

  app.post('/logout', require('./logout').post);

};
