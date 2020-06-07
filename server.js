const http = require("http"),
  app = require("./app"),
  server = http.createServer(app),
  PORT = process.env.PORT || 3000;

const socketio = require("socket.io");
const io = socketio(server);
const { formatMessage } = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  getRoomUsers,
  userLeave,
} = require("./utils/users");

const {
  userLogin,
  userLogout,
  getUserOnline,
  getSenderUser,
} = require("./utils/onlineUsers");

// Socket io
io.on("connection", (socket) => {
  // EMIT = SEND DATA
  // ON = RECEIVE DATA

  socket.on("privateMessage", ({ userTarget, me }) => {
    socket.join(socket.id);

    socket.on("chatMessage", (msg) => {
      const user = getSenderUser(socket.id);

      io.to(userTarget.socketId).emit("bubbleChat", {
        name: me.name,
        text: msg,
      });
    });
  });

  //-----------   To Check UserOnline or not    ----------//
  socket.on("userLogin", ({ userId, name, room }) => {
    const user = userLogin(socket.id, userId, name, room);
    socket.join(user.room);

    // console.log(`${user.name} has login`);

    io.to(user.room).emit("onlineUsers", {
      room: user.room,
      users: getUserOnline(user.room),
    });

    // User off or disconnect
    socket.on("disconnect", async () => {
      const user = userLogout(socket.id);

      if (user) {
        await setTimeout(() => {
          io.to(user.room).emit("onlineUsers", {
            room: user.room,
            users: getUserOnline(user.room),
          });
        }, 10000);
        // console.log(`${user.name} has logout`);
      }
    });
  });

  //--------------Chat Page ------------------//
  //---- Send to js/main ---//
  socket.on("joinRoom", ({ email, room }) => {
    const user = userJoin(socket.id, email, room);

    socket.join(user.room);

    const botName = "Bot Chat";

    // Ketika user baru masuk ke room
    socket.emit("message", formatMessage(botName, " Welcome to Room Chat"));

    // Bisa diterima oleh semua user yang mempunyai koneksi
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.email} has joined the chat`)
      );

    // Dapatkan info user dan room ketika user masuk
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    // Ketika user off/disconnect
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(botName, `${user.email} has left the chat`)
        );
      }
      // Dapatkan info user dan room ketika user leave
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });

    // Mengambil chatMessage
    socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);
      //Mengirim ke user yang baru masuk
      io.to(user.room).emit("message", formatMessage(user.email, msg));
    });
  });
});

server.listen(PORT, console.log(`Server Started on port ${PORT}`));
