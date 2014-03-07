module.exports = function(app) {

  app.get('/', require('./frontpage').get);


};
