import {useRemoteData} from "../../hook/remoteData";
import {useClient} from "../../hook/client";
import {useNavigate} from "react-router";
import Waitlist from "../../component/Waitlist";

export default function RecipesWaitlistPage() {
    const navigate = useNavigate()
    const client = useClient();
    const [recipes, invalidate] = useRemoteData(() => client.recipes.get({visibility: 'waitlist'}), [])

    function acceptRecipe({id}) {
        client.recipes.byId(id).patch({visibility: 'public'})
            .then(invalidate);
    }

    function declineRecipe({id}) {
        client.recipes.byId(id).patch({visibility: 'private'})
            .then(invalidate);
    }

    function showRecipe({id}) {
        navigate(`/recipes/${id}`)
    }

    return <Waitlist items={recipes} onAccept={acceptRecipe} onDecline={declineRecipe} onShow={showRecipe}/>
}
