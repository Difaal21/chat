const mongoose = require("mongoose");
const moment = require("moment");
moment.locale();

const UserChat = new mongoose.Schema({
  user_one: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
    text: {
      type: String,
      required: true,
      send_at: {
        default: moment.defaultFormat("LL, LT"),
        required: true,
      },
    },
  },
  user_two: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
    text: {
      type: String,
      required: true,
      send_at: {
        default: moment.defaultFormat("LL, LT"),
        required: true,
      },
    },
  },
});

const UserChat = mongoose.model("ChatUser", UserChat, "chat_user");

module.exports = User;
