class ValidationError {
    field;
    type;

    constructor(field, type) {
        this.field = field;
        this.type = type;
    }
}

module.exports = {
    fromJoiError: (validationError) => {
        const details = validationError.details[0];
        return new ValidationError(details.context.label, details.type);
    }
}