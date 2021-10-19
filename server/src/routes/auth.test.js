const request = require('supertest')
const app = require('../app')
const db = require('../util/db');

describe('Generate tokens', () => {
    beforeAll(db.open);
    afterAll(db.close);

    describe('when user exists', () => {
        it('should respond with auth tokens', async () => {
            const res = await request(app)
                .post('/api/auth')
                .send(VALID_BODY);

            const {accessToken, refreshToken} = res.body;

            expect(accessToken).toBeDefined();
            expect(refreshToken).toBeDefined();

            await verifyTokenAuthenticates(accessToken, VALID_BODY.username);
        });
    });

    const VALID_BODY = {
        'username': 'testuser',
        'password': 'testpass'
    }
});

async function verifyTokenAuthenticates(token, username) {
    const res = await request(app)
        .get('/api/users/@me')
        .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200);
    expect(res.body.username).toBe(username);
}
