import './App.css';
import {List, ListItem, ListItemIcon} from "@material-ui/core";
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {Restaurant, Fastfood} from '@mui/icons-material';
import {Divider} from "@mui/material";

function App() {
  return (
    <div className="App">
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <List>
                <ListItem>
                    <ListItemButton>
                        <ListItemIcon>
                            <Fastfood />
                        </ListItemIcon>
                        <ListItemText primary="Products" />
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton>
                        <ListItemIcon>
                            <Restaurant />
                        </ListItemIcon>
                        <ListItemText primary="Recipes" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
        <Box>
            <Divider orientation={"vertical"} variant={"middle"}/>
        </Box>
    </div>
  );
}

export default App;
