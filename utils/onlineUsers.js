let users = [];

// get User when user login
function userLogin(socketId, userId, name, room) {
  const user = {
    socketId,
    userId,
    name,
    room,
  };
  users.push(user);
  return user;
}

function getSenderUser(id) {
  return users.find((user) => user.socketId === id);
}

// get User Online
function getUserOnline(room) {
  return users.filter((user) => user.room === room);
}

// get User Logout
function userLogout(id) {
  const index = users.findIndex((user) => user.socketId === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

module.exports = {
  userLogin,
  getUserOnline,
  userLogout,
  getSenderUser,
};
