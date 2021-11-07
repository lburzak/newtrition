import {useReducer} from "react";

const initialAuthState = {
    authenticated: false,
    token: null
};

function authReducer(state, event) {
    if (event.type === 'signedIn') {
        const {username, password} = event.payload;

        // login
        window.location.href = "about:blank";
    }
}

export const useAuthReducer = () => useReducer(authReducer, initialAuthState);