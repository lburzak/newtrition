const {getCollection} = require("../util/db");
const {Result} = require("../common/results");

async function create(ownerUsername, recipe) {
    const Recipes = await getCollection('recipe');

    await Recipes.insertOne({
        name: recipe.name,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        owner: ownerUsername
    });

    return Result.success();
}

async function findUserRecipes(username) {
    const Recipes = await getCollection('recipe');

    const recipes = await Recipes.find({owner: username}).toArray();

    return Result.success(recipes);
}

module.exports = {
    create,
    findUserRecipes
}