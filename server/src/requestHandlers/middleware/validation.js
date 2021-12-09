const buildValidationMiddleware = (validator) => (req, res, next) => {
    const validationResult = validator(req.body);

    if (!validationResult.data.valid)
        return res.status(400).json({errors: validationResult.data.errors});
    
    next();
}

module.exports = {
    buildValidationMiddleware
}