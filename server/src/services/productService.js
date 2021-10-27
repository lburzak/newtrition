const db = require('../util/db');
const {Result} = require('./results');

async function createProduct(ownerUsername, product) {
    const products = db.collection('products');

    await products.insertOne({
        name: product.name,
        ean: product.ean,
        nutritionFacts: product.nutritionFacts
    });

    return Result.empty();
}

module.exports = {
    createProduct
}