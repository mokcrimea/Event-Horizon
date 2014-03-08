module.exports = function(app) {

  app.get('/', require('./frontpage').get);

  app.get('/upload', require('./upload').get);
  app.post('/upload', require('./upload').post);

  app.get('/show', require('./show').get);
};
