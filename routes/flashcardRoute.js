const express = require("express");
const Flashcard = require("../models/flashcardModel");
const verifyUser = require("../middleware/authMiddleware");

const router = express.Router();

// Get flashcards
router.get("/", verifyUser, async (req, res) => {
  const flashcards = await Flashcard.find({ userId: req.user.id }).sort("nextReview");
  res.json(flashcards);
});

// Add flashcard
router.post("/", verifyUser, async (req, res) => {
  const { question, answer } = req.body;
  const newCard = await Flashcard.create({ question, answer, userId: req.user.id });
  res.json(newCard);
});

// Update flashcard (Leitner System)
router.put("/:id", verifyUser, async (req, res) => {
  const { correct } = req.body;
  let flashcard = await Flashcard.findById(req.params.id);

  if (correct) {
    flashcard.box = Math.min(flashcard.box + 1, 5);
  } else {
    flashcard.box = 1;
  }

  const intervals = [1, 2, 4, 7, 14];
  flashcard.nextReview = new Date(Date.now() + intervals[flashcard.box - 1] * 24 * 60 * 60 * 1000);

  await flashcard.save();
  res.json(flashcard);
});

// Delete flashcard
router.delete("/:id", authMiddleware, async (req, res) => {
  await Flashcard.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
