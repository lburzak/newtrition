import './App.css';
import {MainPage} from "./page/MainPage"
import {createTheme, ThemeProvider} from "@mui/material";
import {ClientProvider} from "./hook/client";

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
      <ClientProvider>
          <ThemeProvider theme={theme}>
              <MainPage className="App"/>
          </ThemeProvider>
      </ClientProvider>
  );
}

export default App;
