const RecipeRepository = require('../repositories/recipeRepository');

async function createRecipe(req, res) {
    const result = await RecipeRepository.create(req.targetUser.username, req.body);
    if (!result.error)
        return res.sendStatus(200);

    res.sendStatus(500);
}

module.exports = {
    createRecipe
}