const mongoose = require("mongoose");

const defaultPictureSchema = new mongoose.Schema({
    default_picture: {
        type: Buffer,
        required: true,
    },
});

const DefaultPicture = mongoose.model(
    "DefaultPicture",
    defaultPictureSchema,
    "default_picture"
);

module.exports = DefaultPicture