const {getCollection} = require("../util/db");
const {Result} = require("../common/results");

async function create(ownerUsername, recipe) {
    const Recipes = await getCollection('recipe');

    await Recipes.insertOne({
        name: recipe.name,
        ingredients: recipe.ingredients,
        owner: ownerUsername
    });

    return Result.empty();
}

module.exports = {
    create
}