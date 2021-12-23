const {findByAuthor, create, findAllClasses, findProductById, deleteProductById} = require("../repositories/productRepository");

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

async function deleteProduct(req, res) {
    const productId = req.params.id;

    const product = await findProductById(productId);

    if (!product)
        return res.sendStatus(404);

    if (product.owner !== req.user.username)
        return res.sendStatus(401);

    await deleteProductById(productId);

    res.sendStatus(200);
}

async function getAvailableClasses(req, res) {
    const result = await findAllClasses();

    if (result.isSuccess)
        return res.status(200).send(result.payload);

    return res.sendStatus(500);
}

module.exports = {
    getUserProducts,
    createProduct,
    getAvailableClasses,
    deleteProduct
}