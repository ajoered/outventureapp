const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(User.createStrategy());

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FB_SECRET_KEY,
    callbackURL: "http://localhost:7777/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile.id);
          //check user table for anyone with a facebook ID of profile.id
          User.findOne({
              'facebook': profile.id
          }, function(err, user) {
              if (err) {
                  if (err) console.log(err);
                  return done(err);
              }
              //No user was found... so create a new user with values from Facebook (all the profile. stuff)
              if (!user) {
                  user = new User({
                      name: profile.displayName,
                      email: profile.emails[0].value,
                      facebook: profile.id
                  });
                  user.save(function(err) {
                      if (err) console.log(err);
                      return done(err, user);
                  });
              } else {
                  //found user. Return
                  if (err) console.log(err);
                  return done(err, user);
              }
          });
      }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
