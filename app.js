const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

// EJS
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);

// Load Static File
app.use(express.static(path.join(__dirname, "public")));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport config
require("./config/passport")(passport);

// Connect Flash
app.use(flash());

// Global variabel for display an error
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  next();
});

// Connect to Mongo
const db = require("./config/connect");

const bodyParser = require("body-parser");
// Bodyparse -- extended : true  = to allow you parse extended body with data in it
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// CORS - Handle CORS Error
app.use((req, res, next) => {
  // Allow all client access - you can change * with url website. Example : http://facebook.com
  res.header("Access-Controll-Allow-Origin", "*");
  // What kind of header allowed.
  res.header(
    "Access-Controll-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization"
  );

  // Check if incoming req method
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT",
      "POST",
      "PATCH",
      "GET",
      "DELETE"
    );
    return res.status(200).json({});
  }
  next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

//  Handle if user access there no page
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

// Show error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    Error: {
      message: error.message,
    },
  });
});

module.exports = app;
