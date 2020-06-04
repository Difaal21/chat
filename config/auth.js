module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view this resource");
    res.redirect("/users/login");
  },

  alreadyLogin: (req, res, next) => {
    if (req.user == null) {
      return next();
    }
    res.redirect("/dashboard");
  },
};
