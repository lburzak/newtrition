import {apiAuthenticated} from "./internal";
import Result from "./result";

export const Error = Object.freeze({
    SERVER_ERROR: 0,
    VALIDATION_FAILED: 1
});

export async function createProduct({name, ean, calories, carbohydrate, fat, protein}) {
    const res = await apiAuthenticated('users/@me/products', {
        method: 'POST',
        body: JSON.stringify({
            ean,
            name,
            nutritionFacts: {
                calories,
                carbohydrate,
                fat,
                protein,
                referencePortion: {
                    value: 100,
                    unit: 'g'
                }
            }
        })
    });

    if (res.status === 400) {
        const json = await res.json();

        if (!json.errors)
            return Result.failure(Error.SERVER_ERROR);

        return Result.failure(Error.VALIDATION_FAILED, {
            validationErrors: json.errors
        });
    }

    if (res.status === 200)
        return Result.success();

    throw new TypeError(`status = ${res.status}`);
}