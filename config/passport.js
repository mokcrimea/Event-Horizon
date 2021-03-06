var mongoose = require('mongoose'),
  YandexStrategy = require('passport-yandex').Strategy,
  User = mongoose.model('User');


module.exports = function (passport, config) {

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new YandexStrategy({
    clientID: config.get('yandex:clientID'),
    clientSecret: config.get('yandex:clientSecret'),
    callbackURL: config.get('yandex:callbackURL')
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ 'yandex.id': profile.id }, function (err, user) {
      if (!user) {
          user = new User({
          authToken: accessToken,
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: 'yandex',
          yandex: profile._json
        });
        user.save(function(err){
          if (err) console.log(err);
          return done(err, user);
        });
      } else {

        /**
         * Перезаписывает токен. В документации написанно, что он выдается на
         * неограниченный срок. При изменении прав приложения - текущий токен
         * становится недействительным.
         */

      user.setToken(accessToken, function(err){
        if (err) console.log(err);
      });
      return done(err, user);
      }
    });
  }
));

};