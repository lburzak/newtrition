import Box from "@mui/material/Box";
import {
    Button, Divider,
    List,
    ListItem,
    ListItemIcon,
    Collapse
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import {AccountCircle, Fastfood, Restaurant, ExpandLess, ExpandMore, Search, Edit, Pending} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import {AuthContext} from "../App";
import {useNavigate} from "react-router";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {LoginPage} from "./LoginPage";
import {SignUpPage} from "./SignUpPage";
import {ManageProductsPage} from "./ManageProductsPage";
import {RecipesPage} from "./RecipesPage";
import {CreateRecipePage} from "./CreateRecipePage";
import {EditRecipePage} from "./EditRecipePage";
import {useContext, useState} from "react";
import ProductsWaitlistPage from "./ProductsWaitlistPage";
import SearchProductsPage from "./SearchProductsPage";

const ProfileView = () => <AuthContext.Consumer>
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

const AuthGuard = ({children}) =>
    <AuthContext.Consumer>
        {({authState}) =>
            authState.authenticated ? {...children} : <Navigate to="/login"/>
        }
    </AuthContext.Consumer>

export const MainPage = () =>
    <div style={{display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh'}}>
        <BrowserRouter>
            <AuthContext.Consumer>
                {({authState}) => <SideMenu visible={authState.authenticated}/>}
            </AuthContext.Consumer>
            <Divider variant={'fullWidth'} orientation={'vertical'}/>
            <Routes>
                <Route exact path="/login" element={<LoginPage/>}/>
                <Route exact path="/signup" element={<SignUpPage/>}/>
                <Route path="/products" element={<AuthGuard><SearchProductsPage/></AuthGuard>}/>
                <Route path="/my-products" element={<AuthGuard><ManageProductsPage/></AuthGuard>}/>
                <Route exact path="/recipes" element={<AuthGuard><RecipesPage/></AuthGuard>}/>
                <Route exact path="/recipes/new" element={<AuthGuard><CreateRecipePage/></AuthGuard>}/>
                <Route exact path="/recipes/:id" element={<AuthGuard><EditRecipePage/></AuthGuard>}/>
                <Route exact path="/waitlist/products" element={<AuthGuard><ProductsWaitlistPage/></AuthGuard>}/>
            </Routes>
        </BrowserRouter>
    </div>

function LinkItem({path, name, icon}) {
    const navigate = useNavigate();

    return <ListItemButton sx={{pl: 4}}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} onClick={() => navigate(path)}/>
    </ListItemButton>
}

const SideMenu = ({visible}) => {
    const navigate = useNavigate();
    const {authState} = useContext(AuthContext)

    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    return <Box sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                style={{display: visible ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'space-between'}}>
        <List>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <Fastfood />
                </ListItemIcon>
                <ListItemText primary="Products" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <LinkItem name={"Search"} path={"/products"} icon={<Search/>}/>
                    <LinkItem name={"My products"} path={"/my-products"} icon={<Edit/>}/>
                    {
                        authState.admin
                            ? <LinkItem name={"Waitlist"} path={"/waitlist/products"} icon={<Pending/>}/>
                            : <div/>
                    }
                </List>
            </Collapse>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <Restaurant/>
                    </ListItemIcon>
                    <ListItemText primary="Recipes" onClick={() => navigate('/recipes')}/>
                </ListItemButton>
            </ListItem>
        </List>
        <ProfileView/>
    </Box>;
}