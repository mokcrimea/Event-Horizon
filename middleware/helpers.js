/**
 * Упрощает доступ к переменным в шаблонах
 */

exports.transport = function(req, res, next) {

  res.locals.req = req;

  if (req.flash !== undefined) {

    res.locals.success = req.flash('success');
    res.locals.err = req.flash('error');

  }
  next();

};
/**
 * Функция записывает CSRF токен в cookie
 */
exports.csrf_cookie = function(req, res, next) {
  res.cookie('X-CSRF-Token', req.csrfToken());
  next();
};

/**
 * Функция принимаюзая запрос и возвращающая токен
 * @type {Object}
 */
exports.value = {
  value: function(req) {
    var token = (req.headers['x-csrf-token']) || (req.headers['x-xsrf-token']) || (req.cookies['X-CSRF-Token']);
    return token;
  }
};
