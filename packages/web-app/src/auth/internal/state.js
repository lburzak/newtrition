import AuthStorage from "./storage";

export const initialAuthState = {
    authenticated: false,
    accessToken: null,
    username: null,
    admin: null
};

export function loadAuthState() {
    if (AuthStorage.accessToken && AuthStorage.username)
        return {authenticated: true, accessToken: AuthStorage.accessToken, username: AuthStorage.username, admin: AuthStorage.admin};

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
    } else if (event.type === 'profileFetched') {
        const {admin} = event.payload;

        AuthStorage.admin = admin;

        return {
            ...state,
            admin
        }
    } else if (event.type === 'loggedOut') {
        AuthStorage.clear();

        return {
            authenticated: false
        }
    }
}