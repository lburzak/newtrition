import Box from "@mui/material/Box";
import {Button, Divider, Fab, List, ListItem, ListItemIcon} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import {AccountCircle, Fastfood, Add, Restaurant} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import {AuthContext} from "../App";
import {useContext, useEffect} from "react";
import {useNavigate} from "react-router";

const ProfileView = () => <AuthContext.Consumer>
    {({authState, authDispatch}) => <Box>
        <Divider/>
        <ListItem>
            <ListItemIcon>
                <AccountCircle sx={{fontSize: 38}}/>
            </ListItemIcon>
            <ListItemText primary="Profile" secondary={`Logged in as ${authState.authenticated ? authState.username : "Guest"}`}/>
            <Button variant={"outlined"} onClick={() => authDispatch({type: 'loggedOut'})}>Logout</Button>
        </ListItem>
    </Box>}
</AuthContext.Consumer>

export const DashboardPage = () => {
    const {authState} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authState.authenticated)
            navigate('/login');
    }, [authState, navigate]);

    return <div style={{display: 'flex', flexDirection: 'row', width: '100vw'}}>
        <Box sx={{width: '100%', maxWidth: 360, height: '100vh', bgcolor: 'background.paper'}}
             style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Fastfood/>
                        </ListItemIcon>
                        <ListItemText primary="Products"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Restaurant/>
                        </ListItemIcon>
                        <ListItemText primary="Recipes"/>
                    </ListItemButton>
                </ListItem>
            </List>
            <ProfileView/>
        </Box>
        <Divider variant={'fullWidth'} orientation={'vertical'}/>
        <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end', padding: 20, flex: 1}}>
            <Fab color={'primary'} variant={"extended"} sx={{ mr: 1 }}><Add/> New product</Fab>
        </Box>
    </div>;
}