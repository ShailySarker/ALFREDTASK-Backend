const Flashcard = require("../models/flashcardModel");
const { createFlashcardSchemaValidator, updateFlashcardSchemaValidator } = require("../schemaValidator/flashcardValidator");

// #################  Get flashcard #################
const getFlashcard = async (req, res) => {
    const flashcards = await Flashcard.find({ userId: req.user.id }).sort("nextReview");
    res.json(flashcards);
};


// #################  Create flashcard #################
const createFlashcard = async (req, res) => {
    const validatedBody = await createFlashcardSchemaValidator.validateAsync(req.body);
    const { question, answer } = validatedBody;
    const newCard = await Flashcard.create({ question, answer, userId: req.user.id });
    res.json({ data: newCard, message: "Flashcard deleted successfully" });
};
// #################  Update flashcard #################
const updateFlashcard = async (req, res) => {
    const validatedBody = await updateFlashcardSchemaValidator.validateAsync(req.body);
    const { correct } = validatedBody;
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
    res.json({ data: flashcard, message: "Flashcard updated successfully" });

};

// #################  Delete flashcard #################
const deleteFlashcard = async (req, res) => {
    await Flashcard.findByIdAndDelete(req.params.id);
    res.json({ message: "Flashcard deleted successfully" });
};

module.exports = {
    getFlashcard,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard
};