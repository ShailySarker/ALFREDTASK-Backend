const User = require("../models/userModel");
const Flashcard = require("../models/flashcardModel");

// #################  Get flashcards due for review #################
const getFlashcards = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Get flashcards where nextReview is due
        const flashcardIds = user.flashInfo
            .filter((flash) => new Date(flash.nextReview) <= new Date())
            .map((flash) => flash.flashId);

        // Limit to 5 flashcards per day
        const flashcards = await Flashcard.find({ _id: { $in: flashcardIds } }).limit(5);

        res.json({ data: flashcards, message: `You have ${flashcards.length} flashcards due today.` });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch flashcards" });
    }
};

// #################  Create flashcard #################
const createFlashcard = async (req, res) => {
    try {
        const { question, answer } = req.body;

        const newCard = await Flashcard.create({ question, answer });

        // Add flashcard reference in user document
        await User.findByIdAndUpdate(req.user.id, {
            $push: {
                flashInfo: {
                    flashId: newCard._id,
                    accessDate: new Date().toISOString(),
                    nextReview: new Date(),
                },
            },
        });

        res.json({ data: newCard, message: "Flashcard created successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// #################  Update flashcard (Spaced Repetition) #################
const updateFlashcard = async (req, res) => {
    try {
        const { correct } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Find the user's flashInfo for this flashcard
        const flashInfo = user.flashInfo.find((flash) => flash.flashId === req.params.id);
        if (!flashInfo) return res.status(404).json({ error: "Flashcard not found in user's records" });

        if (correct) {
            flashInfo.box = Math.min(flashInfo.box + 1, 5); // Move up if correct
        } else {
            flashInfo.box = 1; // Reset if wrong
        }

        // Define review intervals based on box level
        const intervals = [1, 2, 4, 7, 14]; // Days
        const nextReviewDate = new Date(Date.now() + intervals[flashInfo.box - 1] * 24 * 60 * 60 * 1000);

        // Update the user's flashInfo
        flashInfo.nextReview = nextReviewDate;
        await user.save();

        res.json({ data: flashInfo, message: "Flashcard updated successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// #################  Delete flashcard #################
const deleteFlashcard = async (req, res) => {
    try {
        const flashcard = await Flashcard.findByIdAndDelete(req.params.id);
        if (!flashcard) return res.status(404).json({ error: "Flashcard not found" });

        // Remove flashcard reference from user document
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { flashInfo: { flashId: req.params.id } },
        });

        res.json({ message: "Flashcard deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete flashcard" });
    }
};

module.exports = {
    getFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard
};