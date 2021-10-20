class ValidationError {
    field;
    message;

    constructor(field, message) {
        this.field = field;
        this.message = message;
    }
}

module.exports = {
    tooLong: (field) => new ValidationError(field, "Too long."),
    tooShort: (field) => new ValidationError(field, "Too short."),
    containsIllegalCharacters: (field) => new ValidationError(field, "Contains illegal characters."),
}