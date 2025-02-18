const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  question: { type: String, require: true },
  answer: { type: String, require: true },
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);
module.exports = Flashcard;