import {Add} from "@mui/icons-material";
import {Fab} from "@mui/material";
import {useNavigate} from "react-router";
import CardsList from "../component/CardsList";
import {useContext} from "react";
import {DataContext} from "../App";
import {ProductCard} from "./ProductsPage";

export function RecipesPage() {
    const navigate = useNavigate();
    const [recipes] = useContext(DataContext).recipes;

    return <div style={{display: 'flex', flexDirection: 'row', flex: 1}}>
        <CardsList>
            {
                recipes.map((recipe, index) => <ProductCard key={`product-${index}`} name={recipe.name}/>)
            }
        </CardsList>
        <Fab color={'primary'} variant={"extended"} sx={{mr: 1}}
             style={{position: 'absolute', right: 20, bottom: 20}} onClick={() => navigate('/recipes/new')}>
            <Add/>New recipe
        </Fab>
    </div>
}