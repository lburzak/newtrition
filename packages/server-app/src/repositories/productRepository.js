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
        photosCount: product.photosCount
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

module.exports = {
    create: create,
    findByAuthor: findByAuthor,
    findAllClasses,
    findProductById,
    deleteProductById
}