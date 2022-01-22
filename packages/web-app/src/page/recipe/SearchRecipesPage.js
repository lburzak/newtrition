import {useRemoteData} from "../../hook/remoteData";
import {useClient} from "../../hook/client";
import CardsList from "../../component/CardsList";
import RecipeCard from "../../component/RecipeCard";

export function SearchRecipesPage() {
    const client = useClient()
    const [recipes] = useRemoteData(() => client.recipes.get({visible: true}), [])

    return <CardsList>
        {
            recipes.map((recipe, index) => <RecipeCard key={`product-${index}`} recipe={recipe}/>)
        }
    </CardsList>
}