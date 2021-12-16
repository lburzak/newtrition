import {createProduct, getUserProducts, getProductsClasses} from "./internal/endpoint/products"
import {initiateLoginFlow, initiateSignUpFlow} from "./internal/endpoint/auth";
export {default as Result} from "./internal/result"

export const ProductsApi = {
    Endpoint: {
        createProduct,
        getUserProducts,
        getProductsClasses
    },
    Error: Object.freeze({
        SERVER_ERROR: 0,
        VALIDATION_FAILED: 1
    })
};

export const AuthApi = {
    Endpoint: {
        initiateSignUpFlow,
        initiateLoginFlow
    },
    Error: Object.freeze({
        USER_ALREADY_EXISTS: 0,
        SERVER_ERROR: 1,
        VALIDATION_FAILED: 2
    })
}

