import CardsList from "../component/CardsList";
import {ProductCard} from "./ManageProductsPage";
import {useContext} from "react";
import {NewtritionClientContext} from "../App";
import {useRemoteData} from "../hook/remoteData";

function getFirstPhotoUrl(id) {
    return `/api/recipes/${id}/photos/0`;
}

export default function UniversalRecipesPage({getRecipes}) {
    const [recipes, invalidate] = useRemoteData(getRecipes, []);
    const client = useContext(NewtritionClientContext)

    return <CardsList>
        {
            recipes.map((recipe, index) => <ProductCard key={`recipe-${index}`} imageSrc={getFirstPhotoUrl(recipe.id)} name={recipe.name} onDelete={() => {
                client.recipes.byId(recipe.id).delete()
                    .then(() => invalidate())
            }}/>)
        }
    </CardsList>
}
