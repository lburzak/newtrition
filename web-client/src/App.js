import './App.css';
import {createContext} from "react";
import {SignUpPage} from "./page/signup";
import {DashboardPage} from "./page/dashboard"
import {createTheme, ThemeProvider} from "@mui/material";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useAuthReducer} from "./reducer/auth";

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
  const [authState, authDispatch] = useAuthReducer();

  return (
      <ThemeProvider theme={theme}>
          <AuthContext.Provider value={{authState, authDispatch}}>
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
