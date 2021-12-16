const request = require("supertest");
const app = require("../src/app");
const _ = require("lodash");
const {retrieveTestToken} = require("../src/util/testUtil");
const {dropDatabase} = require("../src/util/db");

describe('POST /users/:username/recipes', () => {
    const VALID_BODY = {
        "name": "Ravioli",
        "steps": [
            "Mound the flour and salt together and form a well.",
            "Beat the eggs in a bowl."
        ],
        "ingredients": [
            {
                "class": "flour",
                "amount": 120,
                "unit": "g"
            },
            {
                "class": "egg",
                "amount": 36,
                "unit": "g"
            }
        ]
    }

    let token;

    beforeEach(async () => {
        token = await retrieveTestToken();
    })

    afterEach(async () => {await dropDatabase();})

    const makeRequest = (username) => request(app)
        .post(`/api/users/${username}/recipes`)
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

    describe('when recipe is correct', () => {
        it('should respond with 200', async () => {
            const res = await makeRequest("@me")
                .send(VALID_BODY)

            expect(res.status).toBe(200);
        });

        it('should return insert recipe to user recipes', async () => {
            await makeRequest("@me")
                .send(VALID_BODY)

            const res = await request(app)
                .get(`/api/users/@me/recipes`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(expect.arrayContaining([VALID_BODY]));
        });
    })
});