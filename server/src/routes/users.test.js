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

    describe('when registering with illegal username', () => {
        it('should respond with 400 and suitable error when its too short', async () => {
            const res = await request(app)
                .post('/api/users')
                .send({
                    username: "I",
                    password: "testpass"
                });

            expect(res.status).toBe(400);
            expect(res.body).toStrictEqual({
                errors: [
                    {
                        field: 'username',
                        message: 'Too short.'
                    }
                ]
            });
        });

        it('should respond with 400 and suitable error when its too long', async () => {
            const res = await request(app)
                .post('/api/users')
                .send({
                    username: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                    password: "testpass"
                });

            expect(res.status).toBe(400);
            expect(res.body).toStrictEqual({
                errors: [
                    {
                        field: 'username',
                        message: 'Too long.'
                    }
                ]
            });
        });

        it('should respond with 400 and suitable error when it contains illegal characters', async () => {
            const res = await request(app)
                .post('/api/users')
                .send({
                    username: "Illegal Username",
                    password: "testpass"
                });

            expect(res.status).toBe(400);
            expect(res.body).toStrictEqual({
                errors: [
                    {
                        field: 'username',
                        message: 'Contains illegal characters.'
                    }
                ]
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