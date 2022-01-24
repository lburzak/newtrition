import {authReducer, loadAuthState} from "../auth";
import {createContext, useContext, useMemo, useReducer} from "react";
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
        async function login(credentials) {
            let res

            try {
                res = await client.auth.get(credentials)
            } catch (e) {
                throw e
            }

            const token = res.data.accessToken
            authDispatch({type: 'loggedIn', payload: token})
        }

        const client = new NewtritionClient('/api');
        client.token = authState.accessToken;
        client.login = login;
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
