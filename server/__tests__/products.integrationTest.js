const {retrieveTestToken} = require("../src/util/testUtil");
const {dropDatabase} = require("../src/util/db");
const request = require("supertest");
const app = require("../src/app");

describe('GET /products/classes', () => {
    const PRODUCTS = [
        {name: "Masło roślinne", classes: ['margaryna']},
        {name: "Ser Gouda Mlekovita", classes: ['ser żółty', 'ser gouda']}
    ]

    let token;

    beforeEach(async () => {
        token = await retrieveTestToken();
    })

    afterEach(async () => {await dropDatabase();})

    const makeRequest = () => request(app)
        .get(`/api/products/classes`)
        .set('Authorization', `Bearer ${token}`);

    it('should return 200 when authenticated', async () => {
        const res = await makeRequest();

        expect(res.status).toBe(200);
    })

    it('should return all classes when there are products with classes in the DB', async () => {
        for (const i in PRODUCTS)
            await createProduct(PRODUCTS[i], token);

        const res = await makeRequest();

        expect(res.body).toEqual(expect.arrayContaining(['margaryna', 'ser żółty', 'ser gouda']));
    });
});

async function createProduct(product, token) {
    const req = await request(app)
        .post('/api/users/@me/products')
        .set('Authorization', `Bearer ${token}`)
        .send(product);

    console.assert(req.status === 200);
}