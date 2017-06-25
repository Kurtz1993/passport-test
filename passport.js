const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;

const User = mongoose.model('User');
const localOptions = {
    usernameField: 'username'
};

function localStrat() {
    passport.use(new LocalStrategy(localOptions, (username, password, done) => {
        User
            .findOne({ username })
            .then((user) => {
                if (!user) {
                    return done(null, false, { message: 'Username not found' });
                }

                if (!user.authenticate(password)) {
                    return done(null, false, { message: 'Password did not match' });
                }

                return done(null, user);
            })
            .catch(done);
    }));
}


module.exports = function () {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User
            .findById(id, (err, user) => {
                done(err, user);
            });
    });

    localStrat();
};