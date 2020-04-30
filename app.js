const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave
} = require('./utils/users');

// Socket io
io.on("connection", (socket) => {

    //---- Mengirim ke folder js/main ---//
    socket.on('joinRoom', ({
        email,
        room
    }) => {

        const user = userJoin(socket.id, email, room);

        socket.join(user.room);

        const botName = "Bot Chat";

        // Ketika user baru masuk ke room
        socket.emit('message', formatMessage(botName,
            ' Welcome to Room Chat'));

        socket.emit('message', formatMessage(botName,
            ' Welcome to Room Chat'));

        // Bisa diterima oleh semua user yang mempunyai koneksi
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.email} has joined the chat`));

        // Dapatkan info user dan room ketika user masuk
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });


        // Ketika user off/disconnect
        socket.on("disconnect", () => {
            const user = userLeave(socket.id);

            if (user) {
                io.to(user.room).emit('message', formatMessage(botName, `${user.email} has left the chat`));
            }
            // Dapatkan info user dan room ketika user leave
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });

        });
    });


    // Mengambil chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.email, msg)); //Mengirim ke user yang baru masuk
    });
});

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Load CSS
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
mongoose
    .connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

// Bodyparse
app.use(
    express.urlencoded({
        extended: false,
    })
);

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server Started on port ${PORT}`));