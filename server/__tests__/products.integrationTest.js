const {retrieveTestToken, TEST_CREDENTIALS, switchToNewUser} = require("../src/util/testUtil");
const {dropDatabase} = require("../src/util/db");
const request = require("supertest");
const app = require("../src/app");
const {buildTestClient} = require("../src/util/testClient");

describe('GET /products/classes', () => {
    const PRODUCTS = [
        {name: "Masło roślinne", classes: ['margaryna']},
        {name: "Ser Gouda Mlekovita", classes: ['ser żółty', 'ser gouda']}
    ]

    let token;

    beforeEach(async () => {
        token = await retrieveTestToken();
    })

    afterEach(async () => {
        await dropDatabase();
    })

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

describe('DELETE /products/:productId', () => {
    const EXISTING_PRODUCT = {name: "Masło roślinne", classes: ['margaryna']};
    let client;

    beforeEach(async () => {
        client = buildTestClient();
        await client.signup(TEST_CREDENTIALS);
        await client.login(TEST_CREDENTIALS);
    });

    afterEach(async () => {
        await dropDatabase();
    })

    it('should return 404 when such product doesn\'t exist', async () => {
        const res = await client.products.byId("507f1f77bcf86cd799439011").delete();

        expect(res.status).toBe(404);
    });

    it('should return 401 when deleting product of another user', async () => {
        await client.users.self.products.create(EXISTING_PRODUCT);
        const firstProductId = await getIdOfFirstOwnedProductId();
        await switchToNewUser(client, {username: 'newuser', password: 'newpassword'});

        const result = await client.products.byId(firstProductId).delete();

        expect(result.status).toBe(401);
    });

    it('should return 200 when product can be deleted', async () => {
        await client.users.self.products.create(EXISTING_PRODUCT);
        const firstProductId = await getIdOfFirstOwnedProductId();

        const result = await client.products.byId(firstProductId).delete();

        expect(result.status).toBe(200);
    })

    it('should delete product', async () => {
        await client.users.self.products.create(EXISTING_PRODUCT);
        const firstProductId = await getIdOfFirstOwnedProductId();

        await client.products.byId(firstProductId).delete();

        const res = await client.users.self.products.get();
        expect(res.data.length).toBe(0);
    });

    async function getIdOfFirstOwnedProductId() {
        const res = await client.users.self.products.get();
        return res.data[0]._id;
    }
});

async function createProduct(product, token) {
    const req = await request(app)
        .post('/api/users/@me/products')
        .set('Authorization', `Bearer ${token}`)
        .send(product);

    console.assert(req.status === 200);
}