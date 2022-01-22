const {
    findByAuthor,
    create,
    findAllClasses,
    findProductById,
    deleteProductById,
    replaceProductById
} = require("../repositories/productRepository");
const ProductRepository = require('../repositories/productRepository');
const fs = require("fs/promises");
const mime = require("mime-types")
const {makeQuery} = require("../repositories/queryUtil");

async function getUserProducts(req, res) {
    const products = await findByAuthor(req.targetUser.username);

    res.status(200).json(products);
}

async function createProduct(req, res) {
    if (req.targetUser.username !== req.user.username)
        return res.sendStatus(401);

    const product = req.body;
    product.photosCount = req.files.length;
    product.visibility = 'private';

    const result = await create(req.targetUser.username, product);

    if (!result.error) {
        await movePhotosToProductDir(req.files, result.payload._id);
        return res.sendStatus(200);
    }

    return res.sendStatus(500);
}

function getProductPath(productId) {
    return `uploads/products/${productId}/`;
}

async function movePhotosToProductDir(files, productId) {
    for (const [i, file] of files.entries()) {
        const path = getProductPath(productId)
        const fileName = `${i}.${mime.extension(file.mimetype)}`
        await fs.mkdir(path, {recursive: true})
        await fs.rename(file.path, path + fileName)
    }
}

async function clearProductDir(productId) {
    await fs.rm(getProductPath(productId) + '*', {recursive: true})
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

    const files = await fs.readdir(`uploads/products/${productId}`);
    res.sendFile(`uploads/products/${productId}/${files[photoId]}`, {root: '.'})
}

async function replaceProduct(req, res) {
    const productId = req.params.id;
    const currentProduct = await findProductById(productId);

    if (currentProduct.owner !== req.user.username)
        return res.sendStatus(401);

    const {name, ean, nutritionFacts, classes} = req.body;

    const entity = {
        name,
        ean,
        nutritionFacts,
        classes,
        owner: currentProduct.owner,
        photosCount: req.files.length
    }

    const result = await replaceProductById(productId, entity);

    if (result.isSuccess) {
        // TODO: Uncomment
        // await clearProductDir(productId)
        // await movePhotosToProductDir(req.files, productId);
        return res.sendStatus(200);
    }

    return res.sendStatus(500);
}

async function updateProduct(req, res) {
    const productId = req.params.id;
    const {visibility} = req.body;

    const result = await ProductRepository.updateProduct(productId, {visibility});

    if (result.isSuccess) {
        return res.sendStatus(200);
    }

    return res.sendStatus(500);
}

async function getProducts(req, res) {
    const {visibility, visible} = req.query;
    const {username} = req.user;

    const query = makeQuery({visibility, visible, username});
    const result = await ProductRepository.findProducts(query);

    if (result.isSuccess)
        return res.status(200).send(result.payload);

    res.sendStatus(500);
}

module.exports = {
    getUserProducts,
    createProduct,
    getAvailableClasses,
    deleteProduct,
    getProductPhoto,
    replaceProduct,
    updateProduct,
    getProducts
}