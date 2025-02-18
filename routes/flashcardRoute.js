const express = require("express");
const router = express.Router();
const flashcardController = require("../controllers/flashcardController");
const { verifyUser } = require("../middleware/authMiddleware");

router.get("/", verifyUser, flashcardController.getFlashcards);
router.post("/", verifyUser, flashcardController.createFlashcard);
router.put("/:id", verifyUser, flashcardController.updateFlashcard);
router.delete("/:id", verifyUser, flashcardController.deleteFlashcard);

module.exports = router;