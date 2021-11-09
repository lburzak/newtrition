export const initialAuthState = {
    authenticated: false,
    accessToken: null,
    username: null
};

export function loadAuthState() {
    const accessToken = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');

    if (accessToken && username)
        return {authenticated: true, accessToken, username};

    return initialAuthState;
}

export function authReducer(state, event) {
    if (event.type === 'loggedIn') {
        const {accessToken, username} = event.payload;

        localStorage.setItem('username', username);
        localStorage.setItem('accessToken', accessToken);

        return {
            authenticated: true,
            accessToken: accessToken,
            username: username
        };
    }
}