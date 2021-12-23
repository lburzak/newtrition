const UserService = require("./userRepository");
const {ResourceError} = require("../common/results");
const {getCollection, dropDatabase} = require("../util/db");

describe('createUser', () => {
    afterEach(async () => await dropDatabase());

    const VALID_USERNAME = "testuser";
    const VALID_PASSWORD = "testpass";

    it('should save user in the database', async () => {
        await UserService.create(VALID_USERNAME, VALID_PASSWORD);

        const Users = await getCollection('users');
        const userInDatabase = await Users.findOne({username: VALID_USERNAME});

        expect(userInDatabase.username).toBe(VALID_USERNAME);
        expect(userInDatabase.password).toBe(VALID_PASSWORD);
    });

    it('should return results when user already exists', async () => {
        await UserService.create(VALID_USERNAME, VALID_PASSWORD);

        const result = await UserService.create(VALID_USERNAME, VALID_PASSWORD);

        expect(result.error).toBe(ResourceError.ALREADY_EXISTS);
    });
});