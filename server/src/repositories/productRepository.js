const {Result} = require('../common/results');
const {getCollection} = require("../util/db");

async function create(ownerUsername, product) {
    const Products = await getCollection('products');

    await Products.insertOne({
        name: product.name,
        ean: product.ean,
        nutritionFacts: product.nutritionFacts,
        owner: ownerUsername,
        classes: product.classes
    });

    return Result.success();
}

async function findByAuthor(username) {
    const Products = await getCollection('products');

    return await Products.find({
        owner: username
    }).toArray();
}

module.exports = {
    create: create,
    findByAuthor: findByAuthor
}