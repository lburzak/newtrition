import AuthStorage from "./storage";

export const initialAuthState = {
    authenticated: false,
    accessToken: null,
    username: null
};

export function loadAuthState() {
    if (AuthStorage.accessToken && AuthStorage.username)
        return {authenticated: true, accessToken: AuthStorage.accessToken, username: AuthStorage.username};

    return initialAuthState;
}

export function authReducer(state, event) {
    if (event.type === 'loggedIn') {
        const {accessToken, username} = event.payload;

        AuthStorage.username = username;
        AuthStorage.accessToken = accessToken;

        return {
            authenticated: true,
            accessToken: accessToken,
            username: username
        };
    } else if (event.type === 'loggedOut') {
        AuthStorage.clear();

        return {
            authenticated: false
        }
    }
}