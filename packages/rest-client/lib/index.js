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
                delete: async () => await this.httpClient.delete(`/products/${productId}`),
                put: async (product) => await this.httpClient.put(`/products/${productId}`, product)
            })
        }
    }

    get users() {
        return {
            self: {
                profile: async () => await this.httpClient.get('/users/@me'),
                products: {
                    get: async () => await this.httpClient.get('/users/@me/products'),
                    create: async (product) => {
                        return await this.httpClient.post('/users/@me/products',
                            product,
                            {
                                headers: {
                                    "ContentType": "multipart/form-data"
                                }
                            }
                        );
                    }
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
                delete: async () => await this.httpClient.delete(`/recipes/${recipeId}`),
                put: async (recipe) => await this.httpClient.put(`/recipes/${recipeId}`, recipe)
            })
        }
    }
}

module.exports = NewtritionClient;
module.exports.default = NewtritionClient;