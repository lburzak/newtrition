const ValidationError = require('../models/validationError');
const Joi = require("joi");

function validateUsername(username) {
    const field = 'username';
    const errors = [];

    if (username.length < 2)
        errors.push(ValidationError.tooShort(field));

    if (username.length > 40)
        errors.push(ValidationError.tooLong(field));

    if (!/^([A-Za-z\-]+)$/.test(username))
        errors.push(ValidationError.containsIllegalCharacters(field));

    return errors;
}

function validatePassword(password) {
    const field = 'password';
    const errors = [];

    if (password.length < 5)
        errors.push(ValidationError.tooShort(field));

    if (password.length > 64)
        errors.push(ValidationError.tooLong(field));

    return errors;
}

const eanSchema = Joi.string()
    .length(13)
    .pattern(/^[0-9]+$/);

const productSchema = Joi.object({
    ean: eanSchema,
    name: Joi.string().required(),
    nutritionFacts: Joi.object()
})

function validateProduct(product) {
    return productSchema.validate(product);
}

module.exports = {
    validateUsername,
    validatePassword,
    validateProduct
}
