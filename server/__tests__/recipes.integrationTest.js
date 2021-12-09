const request = require("supertest");
const app = require("../src/app");
const _ = require("lodash");
const {retrieveTestToken, TEST_CREDENTIALS} = require("../src/util/testUtil");
const ProductRepository = require("../src/repositories/productRepository")
const {dropDatabase} = require("../src/util/db");

describe('POST /users/:username/recipes', () => {
    const EXISTING_PRODUCTS = [
        {name: "Cheese"},
        {name: "Flour"}
    ]

    const VALID_BODY = {
        name: "Ravioli",
        ingredients: [
            {
                productId: 0,
                unit: "g",
                value: 200
            },
            {
                productId: 1,
                unit: "g",
                value: 50
            }
        ]
    }

    let token;

    beforeEach(async () => {
        token = await retrieveTestToken();
        for (const product in EXISTING_PRODUCTS)
            await ProductRepository.create(TEST_CREDENTIALS.username, product);

        const userProducts = await ProductRepository.findByAuthor(TEST_CREDENTIALS.username);

        for (let i = 0; i < VALID_BODY.ingredients.length; i++)
            VALID_BODY.ingredients[i].productId = userProducts[VALID_BODY.ingredients[i].productId]._id;
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
    })
});