/**
 * General require login middleware
 */

exports.requireLogin = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  if (req.method == 'GET') req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};

/**
 * Authorization for profile manipulate
 */

exports.user = function(req, res, next) {
  if (req.user.id != req.reqUser.id) {
    req.flash('error', 'Извините, вы не авторизованы для совершения этого действия');
    return res.redirect('/user/' + req.params.id);
  }
  next();
};

/**
 * Authorization for track manipulate
 */

exports.track = function(req, res, next) {
  if (req.track._creator != req.user.id) {
    req.flash('error', 'Извините, вы не авторизованы для совершения этого действия');
    return res.redirect('/track/' + req.params.id);
  }
  next();
};

exports.img = function(req, res, next) {
  if (req.track._creator != req.user.id) {
    req.flash('error', 'Извините, вы не авторизованы для совершения этого действия');
    return res.redirect('/track/' + req.params.id);
  }
  next();
};