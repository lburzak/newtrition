const request = require("supertest");
const app = require("../src/app");
const _ = require("lodash");
const {retrieveTestToken} = require("../src/util/testUtil");
const {dropDatabase} = require("../src/util/db");
const {asNewUser} = require("../src/util/testClient");

const VALID_RECIPE = {
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

describe('POST /users/:username/recipes', () => {
    let token;

    beforeEach(async () => {
        token = await retrieveTestToken();
    })

    afterEach(async () => {
        await dropDatabase();
    })

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
                .send(_.omit(VALID_RECIPE, ['name']));

            expect(res.status).toBe(400);
        });
    });

    describe('when recipe is correct', () => {
        it('should respond with 200', async () => {
            const res = await makeRequest("@me")
                .send(VALID_RECIPE)

            expect(res.status).toBe(200);
        });

        it('should return insert recipe to user recipes', async () => {
            await makeRequest("@me")
                .send(VALID_RECIPE)

            const res = await request(app)
                .get(`/api/users/@me/recipes`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.map(recipe => _.omit(recipe, 'id'))).toEqual(expect.arrayContaining([VALID_RECIPE]));
        });
    })
});

describe('DELETE /recipes/:recipeId', () => {
    afterEach(async () => {
        await dropDatabase();
    })

    it('should return 404 when such recipe doesn\'t exist', async () => {
        const res = await asNewUser(async client =>
            await client.recipes.byId("507f1f77bcf86cd799439011").delete());

        expect(res.status).toBe(404)
    });

    it('should return 401 when recipe belongs to another user', async () => {
        const productId = await asNewUser(createRecipeAndGetId);

        const result = await asNewUser(async client => {
            return await client.recipes.byId(productId).delete();
        }, {username: 'newuser', password: 'newpassword'})

        expect(result.status).toBe(401);
    });

    it('should delete recipe', async () => {
        const result = await asNewUser(async client => {
            const recipeId = await createRecipeAndGetId(client);
            await client.recipes.byId(recipeId).delete();
            return await client.users.self.recipes.get();
        });

        expect(result.data.length).toBe(0);
    });

    it('should should return 200 when recipe could be deleted', async () => {
        const res = await asNewUser(async client => {
            await client.users.self.recipes.create(VALID_RECIPE);
            const productId = await createRecipeAndGetId(client)
            return await client.recipes.byId(productId).delete();
        });

        expect(res.status).toBe(200);
    });

    async function createRecipeAndGetId(client) {
        await client.users.self.recipes.create(VALID_RECIPE);
        const res = await client.users.self.recipes.get();
        return res.data[0].id;
    }
});