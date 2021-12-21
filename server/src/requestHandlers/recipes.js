const RecipeRepository = require('../repositories/recipeRepository');

async function createRecipe(req, res) {
    const result = await RecipeRepository.create(req.targetUser.username, req.body);
    if (!result.error)
        return res.sendStatus(200);

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

module.exports = {
    createRecipe,
    getUserRecipes,
    deleteRecipe
}