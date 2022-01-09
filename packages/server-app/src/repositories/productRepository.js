const {Result} = require('../common/results');
const {getCollection} = require("../util/db");
const {ObjectId} = require("mongodb");

async function create(ownerUsername, product) {
    const Products = await getCollection('products');

    const entity = {
        name: product.name,
        ean: product.ean,
        nutritionFacts: product.nutritionFacts,
        owner: ownerUsername,
        classes: product.classes,
        photosCount: product.photosCount,
        visibility: product.visibility
    }

    await Products.insertOne(entity);

    return Result.success(entity);
}

async function findByAuthor(username) {
    const Products = await getCollection('products');

    return await Products.find({
        owner: username
    }).toArray();
}

async function findAllClasses() {
    const Products = await getCollection('products');

    const aggregation = await Products
        .aggregate([
            {$unwind: "$classes"},
            {$group: {_id: "$classes"}},
            {$project: {class: "$_id", _id: 0}}
        ]).toArray();

    const classes = aggregation.map(entry => entry.class);

    return Result.success(classes);
}

async function findProductById(productId) {
    const Products = await getCollection('products');

    return await Products.findOne({_id: ObjectId(productId)});
}

async function deleteProductById(productId) {
    const Products = await getCollection('products');

    await Products.deleteOne({_id: ObjectId(productId)});
}

async function replaceProductById(productId, product) {
    const Products = await getCollection('products');

    await Products.replaceOne({_id: ObjectId(productId)}, product);

    return Result.success()
}

async function updateProduct(productId, product) {
    const {visibility} = product;
    const Products = await getCollection('products');

    await Products.updateOne({_id: ObjectId(productId)}, {$set: {visibility}});

    return Result.success();
}

async function findProducts(predicate) {
    const {visibility} = predicate;

    const Products = await getCollection('products');

    const products = await Products.find({visibility});

    return Result.success(products);
}

module.exports = {
    create: create,
    findByAuthor: findByAuthor,
    findAllClasses,
    findProductById,
    deleteProductById,
    replaceProductById,
    updateProduct,
    findProducts
}