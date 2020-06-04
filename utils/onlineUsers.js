let users = [];

// get User when user login
function userLogin(id, name, room) {
    const user = {
        id,
        name,
        room
    };
    users.push(user);
    return user;
}

// get User Online
function getUserOnline(room) {
    return users.filter(user => user.room === room)
}

// get User Logout
function userLogout(id) {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]; // pisahkan user yang logout
    }
}

module.exports = {
    userLogin,
    getUserOnline,
    userLogout
}