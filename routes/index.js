const express = require("express"),
  router = express.Router(),
  path = require("path"),
  multer = require("multer"),
  fs = require("fs");
const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/User");
const DefaultPicture = require("../models/DefaultPicture");

// index
router.get("/", (req, res) => res.render("welcome"));

// ensureAuthenticated = For prevent user to enter forbidden page

// Dashboard page
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  try {
    const user = req.user;

    if (user.profilePicturePath == undefined) {
      const getDefaultPicture = await DefaultPicture.find().exec();
      const test = getDefaultPicture[0].default_picture.toString("base64");
      user.default_picture = `data:image/jpg;charset=utf-8;base64,${test}`;
    }

    res.render("dashboard", {
      user: user,
    });
  } catch (error) {}
});

// Chat page
router.get("/chat", ensureAuthenticated, (req, res) => {
  res.render("chat");
});

// Upload Picture Profile

// Set Strorage Engine
/* const storage = multer.diskStorage({
  destination: "./public/profile_picture/",
  filename: function (req, file, cb) {
    // req.file kosong
    const originalFileName = file.originalname.split('.')[0];
    cb(
      null,
      originalFileName + "-" + Date.now() + path.extname(file.originalname)
    );
  },
}); */
const storage = multer.memoryStorage();

// Initialize upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("profilePicture");

function checkFileType(file, cb) {
  // Allowerd Ext
  const fileTypes = /jpeg|jpg|png|gif/;

  // Check Ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  // Check Mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  }
  return cb("Error : Images Only");
}

router.post("/dashboard", ensureAuthenticated, (req, res) => {
  const user = req.user;

  upload(req, res, (err) => {
    if (err) {
      req.flash("msg_picture", err);
      return res.render("dashboard", {
        user: user,
        msg_profile_picture: err,
      });
    }

    if (req.file != null) {
      saveImage(user, req.file);
    }

    /* if (user.profile_picture != "default.jpg") {
      removeOldPicture(user)
    } */

    User.findById(user._id).then((result) => {
      return res.render("dashboard", {
        user: result,
      });
    });
  });
});

const imageMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

async function saveImage(user, image) {
  if (image != null && imageMimeTypes.includes(image.mimetype)) {
    try {
      await User.updateOne(
        {
          _id: user._id,
        },
        {
          $set: {
            profile_picture: new Buffer.from(image.buffer, "base64"),
            picture_type: image.mimetype,
          },
        }
      ).exec();
    } catch (error) {
      console.error(err);
    }
  }
}

/* function removeOldPicture(user) {
  fs.unlink("./public/profile_picture/" + user.profile_picture, function (
    err
  ) {
    if (err) console.error(err);
  });
} */

module.exports = router;
