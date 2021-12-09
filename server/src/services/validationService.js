const Joi = require("joi");
const ValidationError = require("../models/validationError");
const {Result} = require("../common/results");

const eanSchema = Joi.string()
    .length(13)
    .pattern(/^[0-9]+$/);

const productSchema = Joi.object({
    ean: eanSchema,
    name: Joi.string().required(),
    nutritionFacts: Joi.object()
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
    ingredients: Joi.array().items(Joi.object({
        productId: Joi.string().required(),
        unit: Joi.string().required(),
        value: Joi.number().required()
    }))
})

const buildValidator = schema => data => {
    const error = schema.validate(data, {abortEarly: false}).error;

    if (!error)
        return Result.withData({valid: true});

    const validationErrors = error.details
        .map(details => ValidationError.fromJoiErrorDetails(details));

    return Result.withData({
        valid: false,
        errors: validationErrors
    });
}

module.exports = {
    validateCredentials: buildValidator(credentialsSchema),
    validateProduct: buildValidator(productSchema),
    validateRecipe: buildValidator(recipeSchema)
}
