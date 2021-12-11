const AuthError = Object.freeze({
    INVALID_TOKEN: "Invalid token.",
    INVALID_USERNAME_OR_PASSWORD: "Invalid username or password."
});

const ResourceError = Object.freeze({
    ALREADY_EXISTS: "Resource already exists",
    NOT_EXISTS: "Resource doesn't exist"
});

class Result {
    payload;
    error;

    constructor({payload, error}) {
        this.payload = payload;
        this.error = error;
    }

    static success(payload) {
        return new Result({payload});
    }

    static failure(error, payload) {
        return new Result({error, payload});
    }

    get isSuccess() { return this.error === undefined || this.error === null; }
    get isFailure() { return !this.isSuccess };
}

module.exports = {
    AuthError,
    ResourceError,
    Result
};