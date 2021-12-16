export const initialProductsState = {
    invalidated: true,
    products: [],
    classes: []
}

export function productsReducer(state, action) {
    switch (action.type) {
        case "invalidate":
            return {...state, invalidated: true};
        case "updateProducts":
            return {...state, products: action.payload};
        case "updateClasses":
            return {...state, classes: action.payload}
        default:
            return state;
    }
}

