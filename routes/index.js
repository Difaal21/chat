const express = require("express");
const router = express.Router();
const {
    ensureAuthenticated
} = require('../config/auth');

// index
router.get("/", (req, res) => res.render("welcome"));

// ensureAuthenticated =  Untuk mencegah user masuk ke halaman yang tidak diinginkan

// Dashboard page
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.render("dashboard", [user = req.user]);
});


// Chat page
router.get('/chat', ensureAuthenticated, (req, res) => {
    // res.render('chat', [user = req.user]);
    res.render('chat');
});

module.exports = router;