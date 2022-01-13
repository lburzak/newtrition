import {AuthContext} from "../App";
import {
    Box, Button, Divider, ListItem, ListItemIcon
} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";

export default function ProfileView() {
    return <AuthContext.Consumer>
        {({authState, authDispatch}) => <Box>
            <Divider/>
            <ListItem>
                <ListItemIcon>
                    <AccountCircle sx={{fontSize: 38}}/>
                </ListItemIcon>
                <ListItemText primary="Profile"
                              secondary={`Logged in as ${authState.authenticated ? authState.username : "Guest"}`}/>
                <Button variant={"outlined"} onClick={() => authDispatch({type: 'loggedOut'})}>Logout</Button>
            </ListItem>
        </Box>}
    </AuthContext.Consumer>
}