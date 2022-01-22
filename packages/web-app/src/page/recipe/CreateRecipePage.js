import {useClient} from "../../hook/client";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {RecipeForm} from "./RecipeForm";

export function CreateRecipePage() {
    const navigate = useNavigate();
    const client = useClient()
    const [submitState, setSubmitState] = useState({
        recipe: null,
        // 'initial' | 'submitted' | 'finished'
        status: 'initial'
    })

    useEffect(() => {
        if (submitState.status !== 'submitted')
            return;

        client.users.self.recipes.create(submitState.recipe).then(() => {
            setSubmitState({status: 'finished'});
        }).catch((error) => {
            console.log(error.response)
            setSubmitState({status: 'initial'});
        })
    }, [submitState, client])

    useEffect(() => {
        if (submitState.status === 'finished')
            navigate('/recipes');
    }, [submitState, navigate])

    return <RecipeForm onSubmit={(recipe) => setSubmitState({recipe, status: 'submitted'})}/>
}
