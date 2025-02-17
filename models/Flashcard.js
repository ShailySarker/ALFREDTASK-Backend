const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  question: { type: String },
  answer: { type: String },
  box: { type: Number, default: 1 },
  nextReview: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Flashcard", flashcardSchema);
