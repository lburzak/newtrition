const AuthService = require('./authService');
const {AuthError} = require('../common/results');
const jwtAuthentication = require('../util/jwtAuthentication');
const db = require("../util/db");

jest.mock('../util/jwtAuthentication');

const VALID_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNjM0NjUyMjcyfQ.vtPtM8VK7rNf1vfcYJi3EUzQRei-6Ic7Lxv-Dywv4i0";

describe('authenticate', () => {
    const USERNAME = 'testuser';
    const INVALID_TOKEN = 'meaningless text';

    it('should return error when token is invalid', async () => {
        jwtAuthentication.verifyToken.mockReturnValueOnce(null);

        const result = AuthService.authenticate(INVALID_TOKEN);

        expect(jwtAuthentication.verifyToken).toBeCalledWith(INVALID_TOKEN)
        expect(result.error).toBe(AuthError.INVALID_TOKEN);
    });

    it('should return user when token is valid', async () => {
        jwtAuthentication.verifyToken.mockReturnValueOnce({username: USERNAME});

        const result = AuthService.authenticate(VALID_TOKEN);

        expect(jwtAuthentication.verifyToken).toBeCalledWith(VALID_TOKEN)
        expect(result.data).toStrictEqual({username: USERNAME});
    });
});

describe('generateTokens', () => {
    const USER = {
        username: 'testuser'
    };

    const VALID_PASSWORD = 'testpass';
    const INVALID_PASSWORD = 'testpassd';

    beforeAll(async () => await db.open());
    afterAll(async () => await db.close());
    afterEach(async () => {
        await db.drop();
        jest.resetAllMocks();
    });

    it('should return tokens when credentials match', async () => {
        jwtAuthentication.generateAccessToken.mockReturnValue(VALID_TOKEN);

        await db.collection('users').insertOne({...USER, password: VALID_PASSWORD});
        const result = await AuthService.generateTokens(USER.username, VALID_PASSWORD);

        expect(result.data.accessToken).toStrictEqual(VALID_TOKEN);
        expect(jwtAuthentication.generateAccessToken).toBeCalledWith(USER);
    });

    it('should return error when credentials dont match', async () => {
        db.collection('users').insertOne({...USER, password: VALID_PASSWORD});
        const result = await AuthService.generateTokens(USER.username, INVALID_PASSWORD);

        expect(result.error).toBe(AuthError.INVALID_USERNAME_OR_PASSWORD);
    });

    it('should return error when user not exists', async () => {
        const result = await AuthService.generateTokens('nosuchuser', VALID_PASSWORD);

        expect(result.error).toBe(AuthError.INVALID_USERNAME_OR_PASSWORD);
    });
});