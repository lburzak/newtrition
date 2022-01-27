import {Fragment, useState} from "react";
import {Edit, Fastfood, Pending, Restaurant, Search, ExpandLess, ExpandMore} from "@mui/icons-material";
import {List, Box, ListItemButton, ListItemIcon, ListItemText, Collapse} from "@mui/material";
import ProfileView from "./ProfileView";
import {useNavigate} from "react-router";
import {useRemoteData} from "../hook/remoteData";

export default function SideMenu({visible}) {
    const [user] = useRemoteData(client => client.users.self.get(), {})

    return <Box sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                style={{display: visible ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'space-between'}}>
        <List>
            <ExpandableMenuItem icon={<Fastfood/>} label={"Products"}>
                <LinkItem name={"Search"} path={"/products"} icon={<Search/>}/>
                <LinkItem name={"My products"} path={"/my-products"} icon={<Edit/>}/>
                {
                    user.admin
                        ? <LinkItem name={"Waitlist"} path={"/waitlist/products"} icon={<Pending/>}/>
                        : <div/>
                }
            </ExpandableMenuItem>
            <ExpandableMenuItem icon={<Restaurant/>} label={"Recipes"}>
                <LinkItem name={"Search"} path={"/recipes"} icon={<Search/>}/>
                <LinkItem name={"My recipes"} path={"/my-recipes"} icon={<Edit/>}/>
                {
                    user.admin
                        ? <LinkItem name={"Waitlist"} path={"/waitlist/recipes"} icon={<Pending/>}/>
                        : <div/>
                }
            </ExpandableMenuItem>
        </List>
        <ProfileView user={user}/>
    </Box>;
}

function LinkItem({path, name, icon}) {
    const navigate = useNavigate();

    return <ListItemButton sx={{pl: 4}} onClick={() => navigate(path)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name}/>
    </ListItemButton>
}

function ExpandableMenuItem({label, icon, children}) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return <Fragment>
        <ListItemButton onClick={handleClick}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={label} />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {children}
            </List>
        </Collapse>
    </Fragment>
}