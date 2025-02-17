const Joi = require('joi');

// ################# Sign Up #################
exports.signUpSchemaValidator = Joi.object({
    fullname: Joi.string()
        .alphanum()
        .min(3)
        .max(15)
        .required()
        .messages({
            'string.base': 'Name should be a text.',
            'string.empty': 'Name is required.',
            'string.min': 'Name should have at least 3 characters.',
            'string.max': 'Name should have a maximum of 15 characters.',
        }),
    email: Joi.string()
        .email()
        .pattern(/^[a-zA-Z0-9._-]+@gmail\.com$/)
        .required()
        .messages({
            'string.pattern.base': 'Email must be a valid Gmail address (e.g., example@gmail.com).',
            'string.empty': 'Email is required.',
        }),
    password: Joi.string()
        .min(8)
        .pattern(/(?=.*[A-Z].*[A-Z])/, 'at least two uppercase letters')
        .pattern(/(?=.*[0-9].*[0-9])/, 'at least two numbers')
        .pattern(/(?=.*[!@#$&*])/, 'a special character')
        .required()
        .messages({
            'string.base': 'Password should be a text.',
            'string.empty': 'Password is required.',
            'string.min': 'Password should have at least 8 characters.',
        }),
});

// ################### Login ###################
exports.loginSchemaValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});