const request = require('supertest')
const app = require('../app')
const db = require('../util/db');

describe('Create user', () => {
    beforeAll(db.open);
    afterAll(db.close);
    afterEach(db.drop)

    describe('when no request body', () => {
        it('should respond with 400', async () => {
            const res = await request(app)
                .post('/api/users');

            expect(res.status).toBe(400);
        })
    });

    describe('when password missing in request body', () => {
        it('should respond with 400', async () => {
            const res = await request(app)
                .post('/api/users')
                .send(MISSING_PASSWORD_BODY);

            expect(res.status).toBe(400);
        });
    });

    describe('when username missing in request body', () => {
        it('should respond with 400', async () => {
            const res = await request(app)
                .post('/api/users')
                .send(MISSING_USERNAME_BODY);

            expect(res.status).toBe(400);
        });
    });

    describe('when registered successfuly', () => {
        it('should create user and respond with 200', async () => {
            const res = await request(app)
                .post('/api/users')
                .send(VALID_BODY);

            const user = await db.collection('users').findOne({username: VALID_BODY.username});

            expect(user.password).toBe(VALID_BODY.password);
            expect(res.status).toBe(200);
        });
    });

    describe('when registering twice with a same name', () => {
        it('should respond with 409', async () => {
            await request(app)
                .post('/api/users')
                .send(VALID_BODY);

            const res = await request(app)
                .post('/api/users')
                .send(VALID_BODY);

            expect(res.status).toBe(409);
        });
    });

    it('should respond with 400 when registering with undefined username', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                username: undefined,
                password: "testpass"
            });

        expect(res.status).toBe(400);
    });

    it('should respond with 400 when registering with undefined password', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                username: "testuser",
                password: undefined
            });

        expect(res.status).toBe(400);
    });

    it('should respond with 400 when registering with illegal username', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                username: "Illegal Username",
                password: "testpass"
            });

        expect(res.status).toBe(400);
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