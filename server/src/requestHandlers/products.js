const {findByAuthor, create} = require("../repositories/productRepository");
const ValidationService = require("../services/validationService");

async function getUserProducts(req, res) {
    const products = await findByAuthor(req.targetUser.username);

    res.status(200).json(products);
}

async function createProduct (req, res) {
    if (req.targetUser.username !== req.user.username)
        return res.sendStatus(401);

    const product = req.body;
    const validationResult = ValidationService.validateProduct(product);

    if (!validationResult.data.valid) {
        return res.status(400).json({errors: validationResult.data.errors});
    }

    const result = await create(req.targetUser.username, req.body);

    if (!result.error) {
        return res.sendStatus(200);
    }

    return res.sendStatus(500);
}

module.exports = {
    getUserProducts,
    createProduct
}