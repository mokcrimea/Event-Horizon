/**
 * Основная проверка авторизации
 */

exports.requireLogin = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  if (req.method == 'GET') req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};

/**
 * Авторизация для просмотра профиля пользователя
 */

exports.user = function(req, res, next) {
  if (req.user.id != req.reqUser.id) {
    req.flash('error', 'Извините, вы не авторизованы для совершения этого действия');
    return res.redirect('/');
  }
  next();
};

/**
 * Авторизация для манипуляции треком и галереей.
 */

exports.track = function(req, res, next) {
  if (req.track._creator != req.user.id) {
    req.flash('error', 'Извините, вы не авторизованы для совершения этого действия');
    return res.redirect('/track/' + req.params.id);
  }
  next();
};
