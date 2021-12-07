import './App.css';
import {createContext, useEffect, useMemo, useReducer} from "react";
import {MainPage} from "./page/MainPage"
import {createTheme, ThemeProvider} from "@mui/material";
import {authReducer, loadAuthState} from "./auth";
import {initialProductsState, productsReducer} from "./repository/productsReducer";
import {ProductsApi} from "./api";

export const AuthContext = createContext();
export const ProductsContext = createContext();

const theme = createTheme({
    typography: {
        fontFamily: "Poppins, sans-serif",
        h3: {
            fontWeight: 200,
            color: "hsl(0, 0%, 20%)"
        }
    }
})

function App() {
  const [authState, authDispatch] = useReducer(authReducer, loadAuthState());
  const [productsState, productsDispatch] = useReducer(productsReducer, initialProductsState);

  useEffect(() => {
     if (productsState.invalidated && authState.authenticated) {
         ProductsApi.Endpoint.getUserProducts().then(result => {
             if (result.isSuccess)
                 productsDispatch({type: 'updateProducts', payload: result.payload})
         })
     }
  }, [productsState, productsDispatch, authState]);

  const authContextValue = useMemo(() => {
        return { authState, authDispatch };
    }, [authState, authDispatch]
  );

  const productsContextValue = useMemo(() => {
      return {productsState, productsDispatch};
  }, [productsState, productsDispatch])

  return (
      <ThemeProvider theme={theme}>
          <AuthContext.Provider value={authContextValue}>
              <ProductsContext.Provider value={productsContextValue}>
                  <MainPage className="App">

                  </MainPage>
              </ProductsContext.Provider>
          </AuthContext.Provider>
      </ThemeProvider>
  );
}

export default App;
