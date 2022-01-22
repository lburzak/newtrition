import {useRemoteData} from "../../hook/remoteData";
import CardsList from "../../component/CardsList";
import RecipeCard from "../../component/RecipeCard";

export function SearchRecipesPage() {
    const [recipes] = useRemoteData((client) => client.recipes.get({visible: true}), [])

    return <CardsList>
        {
            recipes.map((recipe, index) => <RecipeCard key={`product-${index}`} recipe={recipe}/>)
        }
    </CardsList>
}