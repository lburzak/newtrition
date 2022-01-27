import {
    Box, Button, Divider, ListItem, ListItemIcon
} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import {useClient} from "../hook/client";

export default function ProfileView({user}) {
    const client = useClient()

    return <Box>
        <Divider/>
        <ListItem>
            <ListItemIcon>
                <AccountCircle sx={{fontSize: 38}}/>
            </ListItemIcon>
            <ListItemText primary="Profile"
                          secondary={`Logged in as ${user.username ?? "Guest"}`}/>
            <Button variant={"outlined"} onClick={client.logout}>Logout</Button>
        </ListItem>
    </Box>
}