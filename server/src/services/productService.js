const db = require('../util/db');
const {Result} = require('./results');

async function createProduct(ownerUsername, product) {
    const Products = db.collection('products');

    await Products.insertOne({
        name: product.name,
        ean: product.ean,
        nutritionFacts: product.nutritionFacts,
        owner: ownerUsername
    });

    return Result.empty();
}

async function findUserProducts(username) {
    const Products = db.collection('products');

    return await Products.find({
        owner: username
    }).toArray();
}

module.exports = {
    createProduct,
    findUserProducts
}