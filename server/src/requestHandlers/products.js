const {findByAuthor, create} = require("../repositories/productRepository");

async function getUserProducts(req, res) {
    const products = await findByAuthor(req.targetUser.username);

    res.status(200).json(products);
}

async function createProduct (req, res) {
    if (req.targetUser.username !== req.user.username)
        return res.sendStatus(401);

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