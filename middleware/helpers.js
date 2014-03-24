exports.transport = function(req, res, next) {

  res.locals.req = req;

  if (req.flash !== undefined) {

    res.locals.success = req.flash('success');
    res.locals.err = req.flash('error');

  }
  next();

};