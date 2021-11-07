import './App.css';
import {SignUpPage} from "./page/signup";
import {createTheme, ThemeProvider} from "@mui/material";

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
              <SignUpPage/>
          </div>
      </ThemeProvider>
  );
}

export default App;
