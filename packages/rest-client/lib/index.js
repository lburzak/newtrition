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
            get: async (params) => await this.httpClient.get('/products', {params}),
            byId: (productId) => ({
                get: async () => await this.httpClient.get(`/products/${productId}`),
                delete: async () => await this.httpClient.delete(`/products/${productId}`),
                put: async (product) => await this.httpClient.put(`/products/${productId}`, product),
                patch: async (props) => await this.httpClient.patch(`/products/${productId}`, props)
            })
        }
    }

    get users() {
        return {
            self: {
                get: async () => await this.httpClient.get('/users/@me'),
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
            get: async (params) => await this.httpClient.get('/recipes', {params}),
            byId: (recipeId) => ({
                delete: async () => await this.httpClient.delete(`/recipes/${recipeId}`),
                put: async (recipe) => await this.httpClient.put(`/recipes/${recipeId}`, recipe),
                patch: async (props) => await this.httpClient.patch(`/recipes/${recipeId}`, props)
            })
        }
    }
}

module.exports = NewtritionClient;
module.exports.default = NewtritionClient;