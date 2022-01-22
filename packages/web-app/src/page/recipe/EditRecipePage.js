import {useNavigate, useParams} from "react-router";
import {RecipeForm} from "./RecipeForm";
import {useEffect, useState} from "react";
import {useRemoteData} from "../../hook/remoteData";
import {useClient} from "../../hook/client";

export function EditRecipePage() {
    const {id} = useParams();

    const navigate = useNavigate();
    const client = useClient();
    const [submitState, setSubmitState] = useState({
        recipe: null,
        // 'initial' | 'submitted' | 'finished'
        status: 'initial'
    });

    const [recipes] = useRemoteData(client.users.self.recipes.get, []);
    const recipe = recipes.filter(it => it._id === id)[0];

    useEffect(() => {
        if (submitState.status !== 'submitted')
            return;

        client.recipes.byId(id).put(submitState.recipe).then(() => {
            setSubmitState({status: 'finished'});
        }).catch((error) => {
            console.log(error.response)
            setSubmitState({status: 'initial'});
        })
    }, [submitState, client, id])

    useEffect(() => {
        if (submitState.status === 'finished')
            navigate('/recipes');
    }, [submitState, navigate])

    return <RecipeForm defaultRecipe={recipe} onSubmit={(recipe) => setSubmitState({recipe, status: 'submitted'})}/>
}