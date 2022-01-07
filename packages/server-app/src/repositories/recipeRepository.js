const {getCollection} = require("../util/db");
const {Result} = require("../common/results");
const {ObjectId} = require("mongodb");

async function create(ownerUsername, recipe) {
    const Recipes = await getCollection('recipe');

    const entity = {
        name: recipe.name,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        owner: ownerUsername
    };

    await Recipes.insertOne(entity);

    return Result.success(entity);
}

async function findUserRecipes(username) {
    const Recipes = await getCollection('recipe');

    const recipes = await Recipes.find({owner: username}).toArray();

    return Result.success(recipes);
}

async function deleteRecipeById(id) {
    const Recipes = await getCollection('recipe');

    await Recipes.deleteOne({_id: ObjectId(id)});
}

async function getRecipeById(id) {
    const Recipes = await getCollection('recipe');

    return await Recipes.findOne({_id: ObjectId(id)});
}

async function replaceRecipeById(recipeId, recipe) {
    const Recipes = await getCollection('recipe');

    await Recipes.replaceOne({_id: ObjectId(recipeId)}, recipe);

    return Result.success()
}

module.exports = {
    create,
    findUserRecipes,
    deleteRecipeById,
    getRecipeById,
    replaceRecipeById
}