export const Error = Object.freeze({
    USER_ALREADY_EXISTS: 0,
    INVALID_USERNAME_OR_PASSWORD: 1,
    SERVER_ERROR: 2
});

function extractFieldErrors(json, field) {
    return json.errors.filter(error => error['field'] === field);
}

export async function signUp(username, password) {
    const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password})
    });

    switch (res.status) {
        case 409:
            return {error: Error.USER_ALREADY_EXISTS}
        case 400:
            const json = await res.json();

            const usernameErrors = extractFieldErrors(json, 'username');
            const passwordErrors = extractFieldErrors(json, 'password');
            return {
                validationErrors: {
                    username: usernameErrors.length > 0 ? usernameErrors : undefined,
                    password: passwordErrors.length > 0 ? passwordErrors : undefined,
                }
            };
        case 200:
            return {}
        default:
            return {error: Error.SERVER_ERROR}
    }
}
