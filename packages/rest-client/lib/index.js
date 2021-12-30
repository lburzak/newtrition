'use strict'

const axios = require('axios');

class NewtritionClient {
    constructor(url, axiosConfig) {
        this.httpClient = axios.create({
            ...axiosConfig,
            baseURL: url,
            timeout: 1000,
            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    get isAuthenticated() {
        return this.httpClient.defaults.headers.common['Authorization'] !== null;
    }

    set token(value) {
        if (value)
            this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${value}`;
        else
            this.httpClient.defaults.headers.common['Authorization'] = null;
    }

    get auth() {
        return {
            get: async ({username, password}) =>
                await this.httpClient.post('/auth', {username, password}),
            signup: async ({username, password}) =>
                await this.httpClient.post('/auth/signup', {username, password})
        }
    }

    get products() {
        return {
            byId: (productId) => ({
                get: async () => await this.httpClient.get(`/products/${productId}`),
                delete: async () => await this.httpClient.delete(`/products/${productId}`)
            })
        }
    }

    get users() {
        return {
            self: {
                profile: async () => await this.httpClient.get('/users/@me'),
                products: {
                    get: async () => await this.httpClient.get('/users/@me/products'),
                    create: async (product) => await this.httpClient.post('/users/@me/products', convertJsonToFormData(product), {
                        headers: {
                            "ContentType": "multipart/form-data"
                        }
                    })
                },
                recipes: {
                    get: async () => await this.httpClient.get('/users/@me/recipes'),
                    create: async (recipe) => await this.httpClient.post('/users/@me/recipes', recipe)
                }
            }
        }
    }

    get recipes() {
        return {
            byId: (recipeId) => ({
                delete: async () => await this.httpClient.delete(`/recipes/${recipeId}`)
            })
        }
    }
}

function convertJsonToFormData(obj) {
    const data = new FormData()

    for (const key in obj) {
        data.append(key, obj[key])
    }

    return data
}

module.exports = NewtritionClient;
module.exports.default = NewtritionClient;