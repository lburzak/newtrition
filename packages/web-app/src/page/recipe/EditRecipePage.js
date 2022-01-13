import {useNavigate, useParams} from "react-router";
import {DataContext, NewtritionClientContext} from "../../App";
import {RecipeForm} from "./RecipeForm";
import {useContext, useEffect, useState} from "react";

export function EditRecipePage() {
    const {id} = useParams();

    const navigate = useNavigate();
    const client = useContext(NewtritionClientContext)
    const [submitState, setSubmitState] = useState({
        recipe: null,
        // 'initial' | 'submitted' | 'finished'
        status: 'initial'
    });

    const [recipes] = useContext(DataContext).recipes;
    const recipe = recipes.filter(it => it.id === id)[0];

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