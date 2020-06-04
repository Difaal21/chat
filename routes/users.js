const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const {
  alreadyLogin
} = require("../config/auth");

// User Model
const User = require("../models/User");

// Login Page
router.get("/login", alreadyLogin, (req, res) => res.render("users/login"));

// Register Page
router.get("/register", (req, res) => res.render("users/register"));

// Register Handle
router.post("/register", async (req, res) => {
  const {
    name,
    email,
    password,
    confPassword
  } = req.body;

  let errors = [];

  // Check if all field is filled
  if (!name || !email || !password || !confPassword) {
    errors.push({
      msg: "Please fill all fields",
    });
  } else {
    if (password.length < 8) {
      errors.push({
        msg: "Password should be at least 8 character",
      });
    }

    if (password != confPassword) {
      errors.push({
        msg: "Password doesn't match",
      });
    }
  }

  // if  error
  if (errors.length > 0) {
    res.render("users/register", {
      errors,
      name,
      email,
      password,
      confPassword,
    });
  } else {
    // Validation Passed
    User.findOne({
        email: email,
      }).then((user) => {
        if (user) {
          errors.push({
            msg: "Email already register",
          });
          // User exist
          res.render("users/register", {
            errors,
            name,
            email,
            password,
            confPassword,
          });
        } else {
          const newUser = new User({
            name,
            email,
            password,
          });
          // Hash Password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // Set Password to hash
              newUser.password = hash;
              // Save user
              newUser
                .save()
                .then((user) => {
                  req.flash("success_msg", "Registered Success");
                  res.redirect("/users/login");
                })
                .catch((err) => console.log(err));
            });
          });
        }
      })
      .catch(error => console.error(error));
  }
});

// Login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout Handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("succes_msg", "Logout Succesfuly");
  res.redirect("/users/login");
});



module.exports = router;