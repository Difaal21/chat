const LocalStatergy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// User Model
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new LocalStatergy({
            usernameField: 'email',
        }, (email, password, done) => {
            // Check if email already registered
            User.findOne({
                    email: email
                })
                .then(user => {
                    if (!user) {
                        return done(null, false, {
                            message: "Email isn't registered"
                        });
                    }
                    // Matching password with hash password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        // Check if password match
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

    // Change object to bit for session
    passport.serializeUser((user, done) => {
        // Save user id in session and retrieve the whole object via deserializeUser function
        done(null, user.id);
    });

    //  Change bit to object - id = the key of user object send by serializeUser function
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    });
}