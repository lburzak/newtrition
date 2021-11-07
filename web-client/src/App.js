import './App.css';
import {SignUpPage} from "./page/signup";
import {DashboardPage} from "./page/dashboard"
import {createTheme, ThemeProvider} from "@mui/material";
import {BrowserRouter, Routes, Route} from "react-router-dom";

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
  return (
      <ThemeProvider theme={theme}>
          <div className="App">
              <BrowserRouter>
                  <Routes>
                      <Route exact path="/" element={<DashboardPage/>}/>
                      <Route exact path="/signup" element={<SignUpPage />}/>
                  </Routes>
              </BrowserRouter>
          </div>
      </ThemeProvider>
  );
}

export default App;
