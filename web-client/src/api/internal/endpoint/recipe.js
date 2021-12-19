import {apiAuthenticated} from "../api";
import Result from "../result";
import {RecipesApi} from "../../index";

export async function createRecipe({name, steps, ingredients}) {
    const body = {
        name,
        steps,
        ingredients
    };

    const res = await apiAuthenticated('users/@me/recipes', {
        method: 'POST',
        body: JSON.stringify(body)
    });

    if (res.status === 400) {
        const json = await res.json();

        if (!json.errors)
            return Result.failure(RecipesApi.Error.SERVER_ERROR);

        return Result.failure(RecipesApi.Error.VALIDATION_FAILED, {
            validationErrors: json.errors
        });
    }

    if (res.status === 200)
        return Result.success();

    throw new TypeError(`Unexpected status = ${res.status}`);
}