const UserService = require("./userService");
const {ResourceError} = require("./results");
const db = require("../util/db");

describe('createUser', () => {
    beforeAll(db.open);
    afterAll(db.close);

    afterEach(async () => {
        db.collection('users').deleteMany({});
    })

    const VALID_USERNAME = "testuser";
    const VALID_PASSWORD = "testpass";

    it('should save user in the database', async () => {
        await UserService.createUser(VALID_USERNAME, VALID_PASSWORD);

        const users = db.collection('users')
        const userInDatabase = await users.findOne({username: VALID_USERNAME});

        expect(userInDatabase.username).toBe(VALID_USERNAME);
        expect(userInDatabase.password).toBe(VALID_PASSWORD);
    });

    it('should return results when user already exists', async () => {
        await UserService.createUser(VALID_USERNAME, VALID_PASSWORD);

        const result = await UserService.createUser(VALID_USERNAME, VALID_PASSWORD);

        expect(result.error).toBe(ResourceError.ALREADY_EXISTS);
    });
});