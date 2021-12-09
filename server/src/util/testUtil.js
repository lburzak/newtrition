const request = require("supertest");
const app = require("../app");

const TEST_CREDENTIALS = {
    username: 'testuser',
    password: 'testpass'
};

async function createUser() {
    await request(app)
        .post('/api/auth/signup')
        .send(TEST_CREDENTIALS)
}

async function authenticate() {
    const res = await request(app)
        .post('/api/auth')
        .send(TEST_CREDENTIALS);

    return res.body.accessToken;
}

async function retrieveTestToken() {
    await createUser();
    return await authenticate();
}

module.exports = {
    retrieveTestToken,
    TEST_CREDENTIALS
}