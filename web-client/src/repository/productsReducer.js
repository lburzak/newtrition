export const initialProductsState = {
    invalidated: true,
    products: []
}

export function productsReducer(state, action) {
    switch (action.type) {
        case "invalidate":
            return {...state, invalidated: true};
        case "updateProducts":
            return {...state, products: action.payload};
        default:
            return state;
    }
}

