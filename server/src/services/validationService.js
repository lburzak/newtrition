const Joi = require("joi");

const usernameSchema = Joi.string()
    .min(2)
    .max(40)
    .pattern(/^([A-Za-z\-]+)$/);

const passwordSchema = Joi.string()
    .min(5)
    .max(64);

const eanSchema = Joi.string()
    .length(13)
    .pattern(/^[0-9]+$/);

const productSchema = Joi.object({
    ean: eanSchema,
    name: Joi.string().required(),
    nutritionFacts: Joi.object()
});

module.exports = {
    validateUsername: usernameSchema.validate,
    validatePassword: passwordSchema.validate,
    validateProduct: productSchema.validate
}
