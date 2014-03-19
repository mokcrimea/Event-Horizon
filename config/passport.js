var mongoose = require('mongoose'),
  LocalStrategy = require('passport-local').Strategy,
  User = mongoose.model('User');


module.exports = function (passport) {

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, next) {
      User.findOne({ username: username }, function (err, user) {
      if (err) { return next(err); }
      if (!user) {
        return next(null, false, { errors: 'Unknown user' });
      }
      if (!user.checkPassword(password)) {
        return next(null, false, { errors: 'Invalid password' });
      }
      return next(null, user);
    });
  }
));

passport.serializeUser(function(user, next) {
  next(null, user.id);
});

passport.deserializeUser(function(id, next) {
  User.findById(id, function(err, user) {
    next(err, user);
  });
});

};