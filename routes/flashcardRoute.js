const express = require("express");
const router = express.Router();
const flashcardController = require("../controllers/flashcardController");

router.get("/", verifyUser, flashcardController.getFlashcard);
router.post("/", verifyUser, flashcardController.createFlashcard);
router.put("/:id", verifyUser, flashcardController.updateFlashcard);
router.delete("/:id", verifyUser, flashcardController.deleteFlashcard);

module.exports = router;