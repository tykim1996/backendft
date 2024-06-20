const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const userService = require('../services/userService ');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
async (email, password, done) => {
    const user = await userService.findUserByUsername(email);
    if (!user) {
      console.log('Incorrect username');
      return done(null, false, { success: false, msg: 'Incorrect username.' });
    }
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        return done(null, user);
      } else {
        console.log('Incorrect password');
        return done(null, false, { success: false ,msg: 'Incorrect password.' });
      }
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser( async (id, done) =>  {
  const user = await userService.findUserById(id);
  done(null, user);
});

module.exports = passport;
