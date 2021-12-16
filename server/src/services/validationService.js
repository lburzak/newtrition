const Joi = require("joi");
const ValidationError = require("../models/validationError");
const {Result} = require("../common/results");

const eanSchema = Joi.string()
    .length(13)
    .pattern(/^[0-9]+$/);

const productSchema = Joi.object({
    ean: eanSchema,
    name: Joi.string().required(),
    nutritionFacts: Joi.object(),
    classes: Joi.array().items(Joi.string())
});

const credentialsSchema = Joi.object({
    username: Joi.string()
        .min(2)
        .max(40)
        .pattern(/^([A-Za-z\-]+)$/)
        .required(),
    password: Joi.string()
        .min(5)
        .max(64)
        .required()
});

const recipeSchema = Joi.object({
    name: Joi.string().required(),
    steps: Joi.array().items(Joi.string()),
    ingredients: Joi.array().items(Joi.object({
        class: Joi.string().required(),
        unit: Joi.string(),
        amount: Joi.number().required()
    }))
})

const buildValidator = schema => data => {
    const error = schema.validate(data, {abortEarly: false}).error;

    if (!error)
        return Result.success({valid: true});

    const validationErrors = error.details
        .map(details => ValidationError.fromJoiErrorDetails(details));

    return Result.success({
        valid: false,
        errors: validationErrors
    });
}

module.exports = {
    validateCredentials: buildValidator(credentialsSchema),
    validateProduct: buildValidator(productSchema),
    validateRecipe: buildValidator(recipeSchema)
}
