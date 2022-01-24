import {authReducer, loadAuthState} from "../auth";
import {createContext, useContext, useMemo, useReducer} from "react";
import {AuthApi} from "../api";
import NewtritionClient from "@newtrition/rest-client";

const NewtritionClientContext = createContext();
const AuthContext = createContext();

export function ClientProvider({children}) {
    const [authState, authDispatch] = useReducer(authReducer, loadAuthState());

    const authContextValue = useMemo(() => {
            return { authState, authDispatch };
        }, [authState, authDispatch]
    );

    const newtritionClient = useMemo(() => {
        function login({username, password}) {
            AuthApi.Endpoint.initiateLoginFlow({username, password})
                .then(buildLoginResultHandler(authDispatch, newtritionClient));
        }

        function signup({username, password}) {
            AuthApi.Endpoint.initiateSignUpFlow({username, password})
                .then(buildSignUpResultHandler(authDispatch));
        }

        const client = new NewtritionClient('/api');
        client.token = authState.accessToken;
        client.admin = authState.admin;
        client.username = authState.username;
        client.login = login;
        client.signup = signup;
        client.logout = logout;

        return client;
    }, [authState]);

    function logout() {
        authDispatch({type: 'loggedOut'})
    }

    return <AuthContext.Provider value={authContextValue}>
        <NewtritionClientContext.Provider value={newtritionClient}>
            {children}
        </NewtritionClientContext.Provider>
    </AuthContext.Provider>
}

export function useClient() {
    return useContext(NewtritionClientContext)
}

const buildLoginResultHandler = (authDispatch, client) => (result) => {
    if (result.isSuccess) {
        const {accessToken, username} = result.payload;

        client.users.self.get().then((res) => authDispatch({type: 'profileFetched', payload: {admin: res.data.admin}}))

        return authDispatch({type: 'loggedIn', payload: {accessToken, username}});
    }

    if (result.isFailure) {
        return console.error("Something went wrong.");
    }
}

const buildSignUpResultHandler = (authDispatch) => (result) => {
    if (result.isSuccess) {
        const {accessToken, username} = result.payload;
        return authDispatch({type: 'loggedIn', payload: {accessToken, username}});
    }

    switch (result.error) {
        case AuthApi.Error.USER_ALREADY_EXISTS:
            return console.error('userAlreadyExists')
            // return dispatch({type: 'userAlreadyExists'});
        case AuthApi.Error.VALIDATION_FAILED:
            return console.error('validationFailed')
            // return dispatch({type: 'validationFailed', payload: result.payload});
        default:
            return console.error("Something went wrong.");
    }
}