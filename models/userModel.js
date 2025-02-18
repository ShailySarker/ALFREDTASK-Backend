const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    flashInfo: [
        {
            accessDate: { type: String },
            flashId: { type: String },
            box: { type: Number, default: 1},
            nextReview: { type: Date, default: Date.now },
        }
    ]
});

const User = mongoose.model("User", userSchema);
module.exports = User;