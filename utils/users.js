const users = [];

// Join user ke room
function userJoin(id, email, room) {
    const user = {
        id,
        email,
        room
    };
    users.push(user);
    return user;
}

// Dapatkan user yang ngirim pesan
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User meninggalkan chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Room user : get All Users in room
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave,
};