import CardsList from "../component/CardsList";
import {ProductCard} from "./ManageProductsPage";
import {useContext, useEffect, useState} from "react";
import {DataContext, NewtritionClientContext} from "../App";

function getFirstPhotoUrl(id) {
    return `/api/recipes/${id}/photos/0`;
}

export default function UniversalRecipesPage({getRecipes}) {
    const [recipes, setRecipes] = useState(null)
    const client = useContext(NewtritionClientContext)
    const [, invalidateRecipes] = useContext(DataContext).recipes;

    useEffect(() => {
        if (recipes !== null)
            return;

        getRecipes()
            .then(result => setRecipes(result.data))
    }, [client, recipes, setRecipes, getRecipes])

    const recipesSafe = recipes || [];

    return <CardsList>
        {
            recipesSafe.map((recipe, index) => <ProductCard key={`recipe-${index}`} imageSrc={getFirstPhotoUrl(recipe.id)} name={recipe.name} onDelete={() => {
                client.recipes.byId(recipe.id).delete()
                    .then(() => invalidateRecipes())
            }}/>)
        }
    </CardsList>
}