const mongoose = require('mongoose');

// Untuk pemodelan dan validasi
const OnlineUsersSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    is_online: {
        type: Boolean,
        default: true
    },
    login_at: {
        type: Date,
        default: Date.now,
    },
    last_seen: {
        type: Date,
    }
});

const OnlineUsers = mongoose.model('OnlineUsers', OnlineUsersSchema, 'online_users');

module.exports = OnlineUsers;