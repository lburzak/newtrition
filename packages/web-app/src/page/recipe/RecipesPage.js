import {Add} from "@mui/icons-material";
import {Fab} from "@mui/material";
import {useNavigate} from "react-router";
import CardsList from "../../component/CardsList";
import {useContext} from "react";
import {DataContext, NewtritionClientContext} from "../../App";
import {ProductCard} from "../product/ManageProductsPage";

function getFirstPhotoUrl(id) {
    return `/api/recipes/${id}/photos/0`;
}

export function RecipesPage() {
    const navigate = useNavigate();
    const client = useContext(NewtritionClientContext)
    const [recipes, invalidateRecipes] = useContext(DataContext).recipes;

    return <div style={{display: 'flex', flexDirection: 'row', flex: 1}}>
        <CardsList>
            {
                recipes.map((recipe, index) => <ProductCard key={`product-${index}`} imageSrc={getFirstPhotoUrl(recipe.id)} name={recipe.name} onDelete={() => {
                    client.recipes.byId(recipe.id).delete()
                        .then(() => invalidateRecipes())
                }} onEdit={() => navigate(`/recipes/${recipe.id}`)}/>)
            }
        </CardsList>
        <Fab color={'primary'} variant={"extended"} sx={{mr: 1}}
             style={{position: 'absolute', right: 20, bottom: 20}} onClick={() => navigate('/recipes/new')}>
            <Add/>New recipe
        </Fab>
    </div>
}