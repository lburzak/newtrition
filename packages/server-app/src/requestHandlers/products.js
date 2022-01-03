const {findByAuthor, create, findAllClasses, findProductById, deleteProductById} = require("../repositories/productRepository");
const fs = require("fs/promises");
const mime = require("mime-types")

async function getUserProducts(req, res) {
    const products = await findByAuthor(req.targetUser.username);

    res.status(200).json(products);
}

async function createProduct (req, res) {
    if (req.targetUser.username !== req.user.username)
        return res.sendStatus(401);

    const product = req.body;
    product.photosCount = req.files.length;

    const result = await create(req.targetUser.username, product);

    if (!result.error) {
        for (const [i, file] of req.files.entries()) {
            const path = `uploads/products/${result.payload._id}/`
            const fileName = `${i}.${mime.extension(file.mimetype)}`
            await fs.mkdir(path, {recursive: true})
            await fs.rename(file.path, path + fileName)
        }
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

async function getProductPhoto(req, res) {
    const productId = req.params.id;
    const photoId = req.params.photoId;

    const product = await findProductById(productId);

    if (!product)
        return res.status(404).send({error: "No such product"});

    res.sendFile(`uploads/products/${productId}/${photoId}.png`, {root: '.'})
}

module.exports = {
    getUserProducts,
    createProduct,
    getAvailableClasses,
    deleteProduct,
    getProductPhoto
}