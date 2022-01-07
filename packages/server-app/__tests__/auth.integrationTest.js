const request = require('supertest')
const app = require('../src/app')
const {dropDatabase} = require("../src/util/db");

const CREDENTIALS = Object.freeze({
    'username': 'testuser',
    'password': 'testpass'
});

async function createTestUser() {
    await request(app)
        .post('/api/auth/signup')
        .send(CREDENTIALS);
}

describe('Create user', () => {
    afterEach(async () => await dropDatabase());

    describe('when no request body', () => {
        it('should respond with 400', async () => {
            const res = await request(app)
                .post('/api/auth/signup');

            expect(res.status).toBe(400);
        })
    });

    describe('when password missing in request body', () => {
        it('should respond with 400', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send(MISSING_PASSWORD_BODY);

            expect(res.status).toBe(400);
        });
    });

    describe('when username missing in request body', () => {
        it('should respond with 400', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send(MISSING_USERNAME_BODY);

            expect(res.status).toBe(400);
        });
    });

    describe('when registered successfuly', () => {
        it('should respond with 200', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send(VALID_BODY);

            expect(res.status).toBe(200);
        });
    });

    describe('when registering twice with a same name', () => {
        it('should respond with 409', async () => {
            await request(app)
                .post('/api/auth/signup')
                .send(VALID_BODY);

            const res = await request(app)
                .post('/api/auth/signup')
                .send(VALID_BODY);

            expect(res.status).toBe(409);
        });
    });

    describe('when registering with illegal username', () => {
        it('should respond with 400 and suitable error when its too short', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    username: "I",
                    password: "testpass"
                });

            expect(res.status).toBe(400);
            expect(res.body.errors).toContainEqual({
                field: 'username',
                type: "string.min"
            });
        });

        it('should respond with 400 and suitable error when its too long', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    username: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                    password: "testpass"
                });

            expect(res.status).toBe(400);
            expect(res.body.errors).toContainEqual({
                field: 'username',
                type: "string.max"
            });
        });

        it('should respond with 400 and suitable error when it contains illegal characters', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    username: "Illegal Username",
                    password: "testpass"
                });

            expect(res.status).toBe(400);
            expect(res.body.errors).toContainEqual({
                field: 'username',
                type: 'string.pattern.base'
            });
        });
    });

    describe('when registering with illegal password', () => {
        it('should respond with 400 and suitable error when its too short', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    username: "testuser",
                    password: "Ab1#"
                });

            expect(res.status).toBe(400);
            expect(res.body.errors).toContainEqual({
                field: 'password',
                type: 'string.min'
            });
        });

        it('should respond with 400 and suitable error when its too long', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    username: "testuser",
                    password: "Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#Ab1#"
                });

            expect(res.status).toBe(400);
            expect(res.body.errors).toContainEqual({
                field: 'password',
                type: 'string.max'
            });
        });
    });

    const VALID_BODY = {
        'username': 'testuser',
        'password': 'testpass'
    }

    const MISSING_PASSWORD_BODY = {
        'username': 'testuser'
    };

    const MISSING_USERNAME_BODY = {
        'password': 'testpass'
    }
})

describe('Generate tokens', () => {
    describe('when user exists', () => {
        beforeAll(async () => await createTestUser());
        afterAll(async () => await dropDatabase());

        it('should respond with auth tokens', async () => {
            const res = await request(app)
                .post('/api/auth')
                .send(CREDENTIALS);

            expect(res.status).toBe(200);
            await verifyTokenAuthenticates(res.body.accessToken, CREDENTIALS.username);
        });
    });

    describe('when user not exists', () => {
        it('should respond with 401', async () => {
            const res = await request(app)
                .post('/api/auth')
                .send(CREDENTIALS);

            expect(res.status).toBe(401);
        });

        it('should respond with error message', async () => {
            const res = await request(app)
                .post('/api/auth')
                .send(CREDENTIALS);

            expect(res.body).toStrictEqual({
                error: {
                    message: "Invalid username or password."
                }
            });
        });
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
