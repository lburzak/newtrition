const buildValidationMiddleware = (validator) => (req, res, next) => {
    const validationResult = validator(req.body);

    if (!validationResult.payload.valid)
        return res.status(400).json({errors: validationResult.payload.errors});
    
    next();
}

module.exports = {
    buildValidationMiddleware
}