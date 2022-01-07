const RecipeRepository = require('../repositories/recipeRepository');
const fs = require("fs/promises");
const mime = require("mime-types");
const {getRecipeById, replaceRecipeById} = require("../repositories/recipeRepository");

function getRecipePath(productId) {
    return `uploads/recipes/${productId}/`;
}

async function movePhotosToRecipeDir(files, productId) {
    for (const [i, file] of files.entries()) {
        const path = getRecipePath(productId)
        const fileName = `${i}.${mime.extension(file.mimetype)}`
        await fs.mkdir(path, {recursive: true})
        await fs.rename(file.path, path + fileName)
    }
}

async function createRecipe(req, res) {
    const result = await RecipeRepository.create(req.targetUser.username, req.body);
    if (result.isSuccess) {
        await movePhotosToRecipeDir(req.files, result.payload._id)
        return res.sendStatus(200);
    }

    res.sendStatus(500);
}

async function replaceRecipe(req, res) {
    const recipeId = req.params.id;
    const currentRecipe = await getRecipeById(recipeId);

    if (!currentRecipe)
        return res.status(404).send({error: "No such recipe"});

    if (currentRecipe.owner !== req.user.username)
        return res.sendStatus(401);

    const {name, ingredients, steps} = req.body;

    const entity = {
        name, ingredients, steps,
        owner: currentRecipe.owner
    };

    const result = await replaceRecipeById(recipeId, entity);

    if (result.isSuccess) {
        return res.sendStatus(200);
    }

    res.sendStatus(500);
}

function serializeRecipeRecord(record) {
    return {
        id: record._id,
        name: record.name,
        steps: record.steps,
        ingredients: record.ingredients
    }
}

async function getUserRecipes(req, res) {
    const result = await RecipeRepository.findUserRecipes(req.targetUser.username);

    if (result.isSuccess)
        return res.status(200).send(result.payload.map(serializeRecipeRecord));

    res.sendStatus(500);
}

async function deleteRecipe(req, res) {
    const recipeId = req.params.id;

    const recipe = await RecipeRepository.getRecipeById(recipeId);

    if (!recipe)
        return res.sendStatus(404);

    if (recipe.owner !== req.user.username)
        return res.sendStatus(401);

    await RecipeRepository.deleteRecipeById(recipeId);

    res.sendStatus(200);
}

async function getRecipePhoto(req, res) {
    const productId = req.params.id;
    const photoId = req.params.photoId;

    const product = await RecipeRepository.getRecipeById(productId);

    if (!product)
        return res.status(404).send({error: "No such recipe"});

    res.sendFile(`uploads/recipes/${productId}/${photoId}.png`, {root: '.'})
}

module.exports = {
    createRecipe,
    getUserRecipes,
    deleteRecipe,
    getRecipePhoto,
    replaceRecipe
}