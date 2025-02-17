const Joi = require('joi');

// ################# Create Flashcard #################
exports.createFlashcardSchemaValidator = Joi.object({
    question: Joi.string().min(3).max(500).required(),
    answer: Joi.string().min(1).max(500).required(),
    box: Joi.number().integer().min(1).max(5).default(1),
    nextReview: Joi.date().default(Date.now),
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

// ################# Update Flashcard #################
exports.updateFlashcardSchemaValidator = Joi.object({
    question: Joi.string().min(3).max(500).required(),
    answer: Joi.string().min(1).max(500).required(),
    box: Joi.number().integer().min(1).max(5).default(1),
    nextReview: Joi.date().default(Date.now),
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});