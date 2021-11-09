import './App.css';
import {createContext, useMemo, useReducer} from "react";
import {SignUpPage} from "./page/signup";
import {DashboardPage} from "./page/dashboard"
import {createTheme, ThemeProvider} from "@mui/material";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {authReducer, loadAuthState} from "./reducer/auth";

export const AuthContext = createContext();

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

  const authContextValue = useMemo(() => {
        return { authState, authDispatch };
    }, [authState, authDispatch]
  );

  return (
      <ThemeProvider theme={theme}>
          <AuthContext.Provider value={authContextValue}>
              <div className="App">
                  <BrowserRouter>
                      <Routes>
                          <Route exact path="/" element={<DashboardPage/>}/>
                          <Route exact path="/signup" element={<SignUpPage />}/>
                      </Routes>
                  </BrowserRouter>
              </div>
          </AuthContext.Provider>
      </ThemeProvider>
  );
}

export default App;
