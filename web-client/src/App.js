import './App.css';
import {createContext, useEffect, useMemo, useReducer, useState} from "react";
import {MainPage} from "./page/MainPage"
import {createTheme, ThemeProvider} from "@mui/material";
import {authReducer, loadAuthState} from "./auth";
import {ProductsApi, RecipesApi} from "./api";
import NewtritionClient from "js-client";

export const AuthContext = createContext();
export const DataContext = createContext();
export const NewtritionClientContext = createContext();

const theme = createTheme({
    typography: {
        fontFamily: "Poppins, sans-serif",
        h3: {
            fontWeight: 200,
            color: "hsl(0, 0%, 20%)"
        }
    }
})

function useRemoteData(fetch, shouldUpdate) {
    const [data, setData] = useState([]);
    const [invalidated, setInvalidated] = useState(true);

    useEffect(() => {
        if (!invalidated || !shouldUpdate())
            return;

        fetch().then(result => {
            if (result.isSuccess)
                setData(result.payload)
        });

        setInvalidated(false);
    }, [invalidated, setInvalidated, data, setData, fetch, shouldUpdate])

    const invalidate = () => setInvalidated(true);

    const memoizedData = useMemo(() => data, [data])

    return [memoizedData, invalidate]
}

function App() {
  const [authState, authDispatch] = useReducer(authReducer, loadAuthState());

    const newtritionClient = useMemo(() => {
        const client = new NewtritionClient('');
        client.authenticate(authState.accessToken);
        return client;
    }, [authState]);

  const shouldFetchData = () => newtritionClient.isAuthenticated;

  const productsData = useRemoteData(ProductsApi.Endpoint.getUserProducts, shouldFetchData);
  const classesData = useRemoteData(ProductsApi.Endpoint.getProductsClasses, shouldFetchData);
  const recipesData = useRemoteData(RecipesApi.Endpoint.getUserRecipes, shouldFetchData);

  const authContextValue = useMemo(() => {
        return { authState, authDispatch };
    }, [authState, authDispatch]
  );

  return (
      <ThemeProvider theme={theme}>
          <AuthContext.Provider value={authContextValue}>
              <DataContext.Provider value={{
                  products: productsData,
                  classes: classesData,
                  recipes: recipesData
              }}>
                  <NewtritionClientContext.Provider value={newtritionClient}>
                      <MainPage className="App"/>
                  </NewtritionClientContext.Provider>
              </DataContext.Provider>
          </AuthContext.Provider>
      </ThemeProvider>
  );
}

export default App;
