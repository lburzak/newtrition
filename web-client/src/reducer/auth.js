import {useReducer} from "react";

const initialAuthState = {
    authenticated: false,
    accessToken: null,
    username: null
};

async function authReducer(state, event) {
    if (event.type === 'signedIn') {
        const {username, password} = event.payload;

        const accessToken = await fetchToken(username, password);
        const user = await fetchAuthenticatedUser(accessToken);

        return {
            ...state,
            authenticated: true,
            accessToken,
            username: user.username
        };
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
        return json.accessToken;
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
        return {username: json.username};
    }

    throw Error(`status = ${res.status}`);
}

export const useAuthReducer = () => useReducer(authReducer, initialAuthState);