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
import {AuthContext, NewtritionClientContext} from "../App";
import {useNavigate} from "react-router";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {LoginPage} from "./auth/LoginPage";
import {SignUpPage} from "./auth/SignUpPage";
import {ManageProductsPage} from "./product/ManageProductsPage";
import {CreateRecipePage} from "./recipe/CreateRecipePage";
import {EditRecipePage} from "./recipe/EditRecipePage";
import {Fragment, useContext, useState} from "react";
import ProductsWaitlistPage from "./product/ProductsWaitlistPage";
import SearchProductsPage from "./product/SearchProductsPage";
import UniversalRecipesPage from "./recipe/UniversalRecipesPage";
import RecipesWaitlistPage from "./recipe/RecipesWaitlistPage";
import ManageRecipesPage from "./recipe/ManageRecipesPage";

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

export const MainPage = () => {
    const client = useContext(NewtritionClientContext)

    return <div style={{display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh'}}>
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
                <Route exact path="/recipes" element={<AuthGuard><UniversalRecipesPage
                    getRecipes={() => client.recipes.get({visible: true})}/></AuthGuard>}/>
                <Route exact path="/my-recipes" element={<AuthGuard><ManageRecipesPage/></AuthGuard>}/>
                <Route exact path="/recipes/new" element={<AuthGuard><CreateRecipePage/></AuthGuard>}/>
                <Route exact path="/recipes/:id" element={<AuthGuard><EditRecipePage/></AuthGuard>}/>
                <Route exact path="/waitlist/products" element={<AuthGuard><ProductsWaitlistPage/></AuthGuard>}/>
                <Route exact path="/waitlist/recipes" element={<AuthGuard><RecipesWaitlistPage/></AuthGuard>}/>
            </Routes>
        </BrowserRouter>
    </div>;
}

function LinkItem({path, name, icon}) {
    const navigate = useNavigate();

    return <ListItemButton sx={{pl: 4}}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} onClick={() => navigate(path)}/>
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

const SideMenu = ({visible}) => {
    const {authState} = useContext(AuthContext)

    return <Box sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                style={{display: visible ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'space-between'}}>
        <List>
            <ExpandableMenuItem icon={<Fastfood/>} label={"Products"}>
                <LinkItem name={"Search"} path={"/products"} icon={<Search/>}/>
                <LinkItem name={"My products"} path={"/my-products"} icon={<Edit/>}/>
                {
                    authState.admin
                        ? <LinkItem name={"Waitlist"} path={"/waitlist/products"} icon={<Pending/>}/>
                        : <div/>
                }
            </ExpandableMenuItem>
            <ExpandableMenuItem icon={<Restaurant/>} label={"Recipes"}>
                <LinkItem name={"Search"} path={"/recipes"} icon={<Search/>}/>
                <LinkItem name={"My recipes"} path={"/my-recipes"} icon={<Edit/>}/>
                {
                    authState.admin
                        ? <LinkItem name={"Waitlist"} path={"/waitlist/recipes"} icon={<Pending/>}/>
                        : <div/>
                }
            </ExpandableMenuItem>
        </List>
        <ProfileView/>
    </Box>;
}