const LocalStatergy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Model
const User = require('../Models/User');

module.exports = function (passport) {
    passport.use(
        new LocalStatergy({
            usernameField: 'email',
        }, (email, password, done) => {
            // Mengecek jika email sudah terdaftar
            User.findOne({
                    email: email
                })
                .then(user => {
                    if (!user) {
                        return done(null, false, {
                            message: "Email isn't registered"
                        });
                    }
                    // Mencocokkan password dengan yang di hash
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, {
                                message: "Password incorect"
                            });
                        }
                    });
                })
                .catch(err => console.log(err))
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    });
}