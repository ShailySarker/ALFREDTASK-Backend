const mongoose = require("mongoose");

exports.connect = () => {
    mongoose
        .connect(process.env.MONGO_URI, {
        })
        .then(() => {
            console.log("FlashcardDB is connected successfully !");
        })
        .catch((err) => {
            console.log("FlashcardDB is not connected");
            console.error(err);
            process.exit(1);
        });
};