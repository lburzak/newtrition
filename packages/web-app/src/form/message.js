const values = {
    'username': {
        'string.min': 2,
        'string.max': 40,
    },
    'password': {
        'string.min': 5,
        'string.max': 64
    },
    'ean': {
        'string.length': 13
    },
    'classes': {}
};

export function fromValidationError(error) {
    const field = error.field.charAt(0).toUpperCase() + error.field.slice(1);
    const type = error.type;
    const fieldErrors = values[error.field];

    let value = undefined;

    if (fieldErrors) {
        value = fieldErrors[error.type];
    }

    switch (error.type) {
        case "string.min":
            return `${field} must be at least ${value} characters long.`;
        case "string.max":
            return `${field} must be at most ${value} characters long.`;
        case "any.required":
        case "string.empty":
            return `${field} cannot be empty.`;
        case "string.pattern.base":
            return `${field} contains illegal characters.`
        case "string.length":
            return `${field} should be exactly ${value} characters long.`
        default:
            return type
    }
}

const mod = {
    fromValidationError
};

export default mod;