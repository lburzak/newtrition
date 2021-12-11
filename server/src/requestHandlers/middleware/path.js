const UserRepository = require("../../repositories/userRepository");
const {ResourceError} = require("../../common/results");

async function provideUserFromPath(req, res, next) {
    const username = req.params.username;

    if (username === '@me') {
        req.targetUser = req.user;
        return next();
    }

    const result = await UserRepository.findByUsername(username);

    if (result.isFailure) {
        const status = convertServiceErrorToStatus(result.error);
        return res.sendStatus(status);
    }

    req.targetUser = result.payload;
    next();
}

function convertServiceErrorToStatus(error) {
    let status;

    switch (error) {
        case ResourceError.NOT_EXISTS: status = 404; break;
        default: status = 500
    }

    return status;
}

module.exports = {
    provideUserFromPath
}