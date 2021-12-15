const request = require('supertest')
const app = require('../src/app')
const _ = require("lodash");
const {dropDatabase} = require("../src/util/db");
const {retrieveTestToken} = require("../src/util/testUtil");

describe('POST /users/:username/products', () => {
    afterEach(async () => await dropDatabase());

    const VALID_BODY = {
        ean: '7581919399803',
        name: 'Masło roślinne',
        nutritionFacts: {
            calories: 300
        },
        classes: ['margaryna', 'tłuszcz roślinny']
    };

    describe('when not authenticated', () => {
        it('should return 401', async () => {
            const res = await request(app)
                .post('/api/users/@me/products')
                .send(VALID_BODY);

            expect(res.status).toBe(401);
        });
    });

    describe('when authenticated', () => {
        let token;

        beforeEach(async () => {
            token = await retrieveTestToken();
        });

        const makeRequest = (username) => request(app)
            .post(`/api/users/${username}/products`)
            .set('Authorization', `Bearer ${token}`);

        describe('when body is missing', () => {
            it('should respond with 400', async () => {
                const res = await makeRequest("@me");

                expect(res.status).toBe(400);
            });
        });

        describe('when name is missing', () => {
            it('should respond with 400', async () => {
                const res = await makeRequest('@me')
                    .send(_.omit(VALID_BODY, ['name']));

                expect(res.status).toBe(400);
            });
        });

        describe('when username is @me', () => {
            it('should add product to authenticated user space', async () => {
                await makeRequest('@me')
                    .send(VALID_BODY);

                const res = await request(app)
                    .get('/api/users/@me/products')
                    .set('Authorization', `Bearer ${token}`)

                const userProducts = res.body;
                expect(userProducts[0].name).toBe(VALID_BODY.name);
                expect(userProducts[0].classes).toContainEqual('margaryna')
                expect(userProducts[0].classes).toContainEqual('tłuszcz roślinny')
            });

            it('should respond with 200', async () => {
                const res = await makeRequest('@me')
                    .send(VALID_BODY);

                expect(res.status).toBe(200);
            });
        });

        describe('when username belongs to other user', () => {
            const OTHER_USER_NAME = "otheruser";

            async function addAnotherUser() {
                await request(app)
                    .post('/api/auth/signup')
                    .send({
                        username: OTHER_USER_NAME,
                        password: "testpass"
                    })
            }

            beforeEach(addAnotherUser);

            it('should respond with 401', async () => {
                const res = await makeRequest(OTHER_USER_NAME)
                    .send(VALID_BODY);

                expect(res.status).toBe(401);
            });
        });
    });
});