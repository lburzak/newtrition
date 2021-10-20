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
    const field = 'password';
    const errors = [];

    if (password.length < 5)
        errors.push(ValidationError.tooShort(field));

    if (password.length > 64)
        errors.push(ValidationError.tooLong(field));

    return errors;
}

module.exports = {
    validateUsername,
    validatePassword
}
