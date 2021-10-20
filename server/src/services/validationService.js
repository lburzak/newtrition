const ValidationError = require('../models/validationError');

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
    return [];
}

module.exports = {
    validateUsername,
    validatePassword
}
