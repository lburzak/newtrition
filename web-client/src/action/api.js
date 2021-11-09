import Result from "./result";

export const Error = Object.freeze({
    USER_ALREADY_EXISTS: 0,
    SERVER_ERROR: 1,
    VALIDATION_FAILED: 2
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
            return Result.failure(Error.USER_ALREADY_EXISTS);
        case 400:
            const json = await res.json();

            const usernameErrors = extractFieldErrors(json, 'username');
            const passwordErrors = extractFieldErrors(json, 'password');

            const validationErrors = {
                username: usernameErrors.length > 0 ? usernameErrors : undefined,
                password: passwordErrors.length > 0 ? passwordErrors : undefined,
            };

            return Result.failure(Error.VALIDATION_FAILED, validationErrors);
        case 200:
            return Result.success();
        default:
            return Result.failure(Error.SERVER_ERROR);
    }
}

async function fetchToken(username, password) {
    const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password})
    });

    if (res.status === 200) {
        const json = await res.json();
        return Result.success(json.accessToken);
    }

    throw Error(`status = ${res.status}`);
}

async function fetchAuthenticatedUser(token) {
    const res = await fetch('/api/users/@me', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (res.status === 200) {
        const json = await res.json();
        return Result.success({username: json.username});
    }

    throw Error(`status = ${res.status}`);
}

export async function initiateSignUpFlow({username, password}) {
    const signUpResult = await signUp(username, password);

    if (signUpResult.isFailure)
        return Result.failure(signUpResult.error, signUpResult.payload)

    const tokenResult = await fetchToken(username, password);

    if (tokenResult.isSuccess) {
        const userResult = await fetchAuthenticatedUser(tokenResult.payload);

        if (userResult.isSuccess)
            return Result.success({
                username: userResult.payload.username,
                accessToken: tokenResult.payload
            });
    }

    return Result.failure(Error.SERVER_ERROR);
}
