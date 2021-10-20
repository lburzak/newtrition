const request = require('supertest')
const app = require('../app')
const db = require('../util/db');

const CREDENTIALS = Object.freeze({
    'username': 'testuser',
    'password': 'testpass'
});

async function createTestUser() {
    await request(app)
        .post('/api/users')
        .send(CREDENTIALS);
}

describe('Generate tokens', () => {
    beforeAll(db.open);
    afterAll(db.close);

    describe('when user exists', () => {
        beforeAll(createTestUser);
        afterAll(db.drop);

        it('should respond with auth tokens', async () => {
            const res = await request(app)
                .post('/api/auth')
                .send(CREDENTIALS);

            expect(res.status).toBe(200);
            await verifyTokenAuthenticates(res.body.accessToken, CREDENTIALS.username);
        });
    });

    describe('when user not exists', () => {

    });

    describe('when credentials are not sent', () => {
        it('should respond with 400', async () => {
            const res = await request(app)
                .post('/api/auth');

            expect(res.status).toBe(400);
        });
    });
});

async function verifyTokenAuthenticates(token, username) {
    const res = await request(app)
        .get('/api/users/@me')
        .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200);
    expect(res.body.username).toBe(username);
}
