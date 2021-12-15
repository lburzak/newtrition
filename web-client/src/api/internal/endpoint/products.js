import {apiAuthenticated} from "../api";
import Result from "../result";
import {ProductsApi} from "../../index";

export async function createProduct({name, ean, calories, carbohydrate, fat, protein}) {
    const body = {
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
    };

    if (ean.length > 0)
        body.ean = ean

    const res = await apiAuthenticated('users/@me/products', {
        method: 'POST',
        body: JSON.stringify(body)
    });

    if (res.status === 400) {
        const json = await res.json();

        if (!json.errors)
            return Result.failure(ProductsApi.Error.SERVER_ERROR);

        return Result.failure(ProductsApi.Error.VALIDATION_FAILED, {
            validationErrors: json.errors
        });
    }

    if (res.status === 200)
        return Result.success();

    throw new TypeError(`Unexpected status = ${res.status}`);
}

export async function getUserProducts() {
    const res = await apiAuthenticated('users/@me/products', {
        method: 'GET'
    });

    if (res.status === 200) {
        const products = await res.json();
        return Result.success(products);
    }

    throw new TypeError(`Unexpected status = ${res.status}`);
}