import {Divider} from "@mui/material";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {LoginPage} from "./auth/LoginPage";
import {SignUpPage} from "./auth/SignUpPage";
import {ManageProductsPage} from "./product/ManageProductsPage";
import {CreateRecipePage} from "./recipe/CreateRecipePage";
import {EditRecipePage} from "./recipe/EditRecipePage";
import ProductsWaitlistPage from "./product/ProductsWaitlistPage";
import SearchProductsPage from "./product/SearchProductsPage";
import RecipesWaitlistPage from "./recipe/RecipesWaitlistPage";
import ManageRecipesPage from "./recipe/ManageRecipesPage";
import SideMenu from "../component/SideMenu";
import {SearchRecipesPage} from "./recipe/SearchRecipesPage";
import {useClient} from "../hook/client";
import {Fragment} from "react";

export const MainPage = () => {
    const client = useClient()

    return <div style={{display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh'}}>
        <BrowserRouter>
            {client.isAuthenticated ? <SideMenu visible={client.isAuthenticated}/> : <Fragment/>}
            <Divider variant={'fullWidth'} orientation={'vertical'}/>
            <Routes>
                <Route exact path="/" element={<AuthGuard><SearchProductsPage/></AuthGuard>}/>
                <Route exact path="/login" element={<LoginPage/>}/>
                <Route exact path="/signup" element={<SignUpPage/>}/>
                <Route exact path="/products" element={<AuthGuard><SearchProductsPage/></AuthGuard>}/>
                <Route exact path="/my-products" element={<AuthGuard><ManageProductsPage/></AuthGuard>}/>
                <Route exact path="/recipes" element={<AuthGuard><SearchRecipesPage/></AuthGuard>}/>
                <Route exact path="/my-recipes" element={<AuthGuard><ManageRecipesPage/></AuthGuard>}/>
                <Route exact path="/recipes/new" element={<AuthGuard><CreateRecipePage/></AuthGuard>}/>
                <Route exact path="/recipes/:id" element={<AuthGuard><EditRecipePage/></AuthGuard>}/>
                <Route exact path="/waitlist/products" element={<AuthGuard><ProductsWaitlistPage/></AuthGuard>}/>
                <Route exact path="/waitlist/recipes" element={<AuthGuard><RecipesWaitlistPage/></AuthGuard>}/>
            </Routes>
        </BrowserRouter>
    </div>;
}

function AuthGuard({children}) {
    const client = useClient()

    return client.isAuthenticated ? children : <Navigate to="/login"/>
}
