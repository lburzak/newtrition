import Box from "@mui/material/Box";
import {List, ListItem, ListItemIcon} from "@material-ui/core";
import ListItemButton from "@mui/material/ListItemButton";
import {Fastfood, Restaurant} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import {Divider} from "@mui/material";
import {AuthContext} from "../App";

export const DashboardPage = () => <div>
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <AuthContext.Consumer>
            {value => <p>Hello {value.authState.username}</p>}
        </AuthContext.Consumer>
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