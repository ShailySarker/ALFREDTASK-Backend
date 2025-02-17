const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  question: { type: String, require: true },
  answer: { type: String, require: true },
  box: { type: Number, default: 1, require: true },
  nextReview: { type: Date, default: Date.now, require: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);
module.exports = Flashcard;