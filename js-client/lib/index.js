'use strict'

const axios = require('axios');

class NewtritionClient {
    httpClient;

    constructor(url, axiosConfig) {
        this.httpClient = axios.create({
            ...axiosConfig,
            baseURL: url,
            timeout: 1000,
            headers: {
                "Content-Type": "application/json",
            }
        })
    }

    get isAuthenticated() {
        return this.httpClient.defaults.headers.common['Authorization'] !== null;
    }

    login = async ({username, password}) => {
        const res = await this.httpClient.post('/auth', {username, password})
        this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${res.data['accessToken']}`;
    }

    logout = async () => {
        this.httpClient.defaults.headers.common['Authorization'] = null;
    }

    signup = async ({username, password}) => await this.httpClient.post('/auth/signup', {username, password})

    products = {
        byId: (productId) => ({
            get: async () => await this.httpClient.get(`/products/${productId}`),
            delete: async () => await this.httpClient.delete(`/products/${productId}`)
        })
    }

    users = {
        self: {
            profile: async () => await this.httpClient.get('/users/@me'),
            products: {
                get: async () => await this.httpClient.get('/users/@me/products'),
                create: async (product) => await this.httpClient.post('/users/@me/products', product)
            },
            recipes: {
                get: async () => await this.httpClient.get('/users/@me/recipes'),
                create: async (recipe) => await this.httpClient.post('/users/@me/recipes', recipe)
            }
        }
    }

    recipes = {
        byId: (recipeId) => ({
            delete: async () => await this.httpClient.delete(`/recipes/${recipeId}`)
        })
    }
}

module.exports = NewtritionClient;
module.exports.default = NewtritionClient;