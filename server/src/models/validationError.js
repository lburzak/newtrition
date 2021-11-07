class ValidationError {
    field;
    type;

    constructor(field, type) {
        this.field = field;
        this.type = type;
    }
}

module.exports = {
    fromJoiErrorDetails: (joiDetails) => {
        return new ValidationError(joiDetails.context.label, joiDetails.type);
    }
}