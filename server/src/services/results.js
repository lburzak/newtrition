const AuthError = Object.freeze({
    INVALID_TOKEN: "Invalid token.",
    INVALID_USERNAME_OR_PASSWORD: "Invalid username or password."
});

const ResourceError = Object.freeze({
    ALREADY_EXISTS: "Resource already exists",
});

const Result = {
    withError: (error) => ({error}),
    withData: (data) => ({data}),
    empty: () => ({})
}

module.exports = {
    AuthError,
    ResourceError,
    Result
};