import {rainbow} from "./color"

export function getDefaultProductPhoto(id) {
    return `/api/products/${id}/photos/0`;
}

export function getDefaultRecipePhoto(id) {
    return `/api/recipes/${id}/photos/0`
}

export function getPlaceholderPhotoUrl(photosCount, photoKey, text) {
    const color = rainbow(photosCount, photoKey);
    return `https://craftypixels.com/placeholder-image/400x200/${color}/fff&text=${text}`;
}

export function randomPlaceholderGenerator() {
    return function getPlaceholderUrl(text) {
        return getPlaceholderPhotoUrl(200, Math.random() * 200, text);
    }
}