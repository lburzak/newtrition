import Box from "@mui/material/Box";
import {
    Button, Divider,
    List,
    ListItem,
    ListItemIcon
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import {AccountCircle, Fastfood, Restaurant} from "@mui/icons-material";
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
import {useContext} from "react";
import ProductsWaitlistPage from "./ProductsWaitlistPage";

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
                <Route path="/my-products" element={<AuthGuard><ManageProductsPage/></AuthGuard>}/>
                <Route exact path="/recipes" element={<AuthGuard><RecipesPage/></AuthGuard>}/>
                <Route exact path="/recipes/new" element={<AuthGuard><CreateRecipePage/></AuthGuard>}/>
                <Route exact path="/recipes/:id" element={<AuthGuard><EditRecipePage/></AuthGuard>}/>
                <Route exact path="/waitlist/products" element={<AuthGuard><ProductsWaitlistPage/></AuthGuard>}/>
            </Routes>
        </BrowserRouter>
    </div>

const SideMenu = ({visible}) => {
    const navigate = useNavigate();
    const {authState} = useContext(AuthContext)

    return <Box sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                style={{display: visible ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'space-between'}}>
        <List>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <Fastfood/>
                    </ListItemIcon>
                    <ListItemText primary="My products" onClick={() => navigate('/my-products')}/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <Restaurant/>
                    </ListItemIcon>
                    <ListItemText primary="Recipes" onClick={() => navigate('/recipes')}/>
                </ListItemButton>
            </ListItem>
            {
                authState.admin ?
                    <div>
                        <Divider orientation={"horizontal"}/>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <Restaurant/>
                                </ListItemIcon>
                                <ListItemText primary="Products waitlist"
                                              onClick={() => navigate('/waitlist/products')}/>
                            </ListItemButton>
                        </ListItem>
                    </div> : <div/>
            }
        </List>
        <ProfileView/>
    </Box>;
}