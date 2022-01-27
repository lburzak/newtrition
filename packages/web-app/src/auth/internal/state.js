import AuthStorage from "./storage";

export const initialAuthState = {
    authenticated: false,
    accessToken: null,
    username: null,
    admin: null
};

export function loadAuthState() {
    if (AuthStorage.accessToken)
        return {authenticated: true, accessToken: AuthStorage.accessToken};

    return initialAuthState;
}

export function authReducer(state, event) {
    if (event.type === 'loggedIn') {
        const accessToken = event.payload;

        AuthStorage.accessToken = accessToken;

        return {
            authenticated: true,
            accessToken: accessToken
        };
    } else if (event.type === 'profileFetched') {
        const {admin, username} = event.payload;

        AuthStorage.admin = admin;
        AuthStorage.username = username;

        return {
            ...state,
            admin,
            username
        }
    } else if (event.type === 'loggedOut') {
        AuthStorage.clear();

        return {
            authenticated: false
        }
    }
}