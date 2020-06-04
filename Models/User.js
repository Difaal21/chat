const mongoose = require("mongoose"),
  path = require("path");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_picture: {
    type: Buffer,
    // required: true,
  },
  picture_type: {
    type: String,
    // required: true,
  },
  role_user: {
    type: String,
    required: true,
    default: 'basic'
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const profilePicturePath = "profile_picture";

UserSchema.virtual("profilePicturePath").get(function () {
  if (this.profile_picture != null) {
    return `data:${
      this.picture_type
    };charset=utf-8;base64,${this.profile_picture.toString("base64")}`;
  }

  // if (this.profile_picture === undefined) {
  //   return path.join("/", profilePicturePath, "default.jpg");
  // }
});

// Memakai model 'User', dengan skema  UserSchema yang ditentukan sebelumnya, 'user' nama koleksi
const User = mongoose.model("User", UserSchema, "users");

module.exports = User;
module.exports.profilePicturePath = profilePicturePath;