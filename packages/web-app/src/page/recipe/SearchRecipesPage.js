import {useRemoteData} from "../../hook/remoteData";
import {useContext} from "react";
import {NewtritionClientContext} from "../../App";
import CardsList from "../../component/CardsList";
import RecipeCard from "../../component/RecipeCard";

export function SearchRecipesPage() {
    const client = useContext(NewtritionClientContext)
    const [recipes] = useRemoteData(() => client.recipes.get({visible: true}), [])

    return <CardsList>
        {
            recipes.map((recipe, index) => <RecipeCard key={`product-${index}`} recipe={recipe}/>)
        }
    </CardsList>
}