import {NewtritionClientContext} from "../../App";
import {useRemoteData} from "../../hook/remoteData";
import {useContext} from "react";
import CardsList from "../../component/CardsList";
import {useNavigate} from "react-router";
import {Fab} from "@mui/material";
import {Add, Delete, Edit, Public} from "@mui/icons-material";
import {CardMenu} from "../../component/CardItem";
import RecipeCard from "../../component/RecipeCard";

export default function ManageRecipesPage() {
    const client = useContext(NewtritionClientContext);
    const navigate = useNavigate();
    const [recipes, invalidate] = useRemoteData(() => client.recipes.get({visible: true}), [])

    function publishRecipe(id) {
        client.recipes.byId(id).patch({visibility: 'waitlist'})
            .then(invalidate);
    }

    function deleteRecipe(id) {
        client.recipes.byId(id).delete()
            .then(() => invalidate())
    }

    return <div style={{display: 'flex', flexDirection: 'row', flex: 1}}>
        <CardsList>
            {
                recipes.map((recipe, index) => <RecipeCard
                    key={`product-${index}`}
                    recipe={recipe}
                    menu={<CardMenu items={[{
                        label: "Edit",
                        icon: <Edit fontSize="small"/>,
                        onClick: () => navigate(`/recipes/${recipe.id}`)
                    }, {
                        label: "Delete",
                        icon: <Delete fontSize="small"/>,
                        onClick: () => deleteRecipe(recipe._id)
                    }, {
                        label: "Publish",
                        icon: <Public fontSize="small"/>,
                        onClick: () => publishRecipe(recipe._id)
                    }]}/>}
                />)
            }
        </CardsList>
        <Fab color={'primary'} variant={"extended"} sx={{mr: 1}}
             style={{position: 'absolute', right: 20, bottom: 20}} onClick={() => navigate('/recipes/new')}>
            <Add/>New recipe
        </Fab>
    </div>
}

