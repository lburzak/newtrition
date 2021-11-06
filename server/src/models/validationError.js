class ValidationError {
    field;
    message;

    constructor(field, message) {
        this.field = field;
        this.message = message;
    }
}

module.exports = {
    fromJoiError: (validationError) => new ValidationError(validationError.details[0].path[0], validationError.message)
}