const request = require("supertest");
const app = require("../app");

const CREDENTIALS = {
    username: 'testuser',
    password: 'testpass'
};

async function createUser() {
    await request(app)
        .post('/api/auth/signup')
        .send(CREDENTIALS)
}

async function authenticate() {
    const res = await request(app)
        .post('/api/auth')
        .send(CREDENTIALS);

    return res.body.accessToken;
}

async function retrieveTestToken() {
    await createUser();
    return await authenticate();
}

module.exports = {
    retrieveTestToken
}