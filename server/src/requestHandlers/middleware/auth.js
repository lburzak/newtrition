const AuthService = require('../../services/authService')

function provideAuthenticatedUser(req, res, next) {
    const token = extractToken(req);

    if (!token)
        return res.sendStatus(401);

    const result = AuthService.authenticate(token);

    if (result.error)
        return res.sendStatus(401);

    req.user = result.data;
    next();
}

function extractToken(req) {
    const authorization = req.headers.authorization;

    if (!authorization)
        return null;

    const [scheme, token] = authorization.split(' ');

    if (scheme !== "Bearer")
        return null;

    return token;
}

module.exports = {
    provideAuthenticatedUser
};