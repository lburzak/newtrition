import {NewtritionClientContext} from "../App";
import {useRemoteData} from "../hook/remoteData";
import {useContext} from "react";
import CardsList from "../component/CardsList";
import {ProductCard} from "./ManageProductsPage";
import {useNavigate} from "react-router";
import {Fab} from "@mui/material";
import {Add} from "@mui/icons-material";

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
                    onPublish={() => publishRecipe(recipe._id)}
                    onDelete={() => deleteRecipe(recipe._id)}
                    onEdit={() => navigate(`/recipes/${recipe.id}`)}
                />)
            }
        </CardsList>
        <Fab color={'primary'} variant={"extended"} sx={{mr: 1}}
             style={{position: 'absolute', right: 20, bottom: 20}} onClick={() => navigate('/recipes/new')}>
            <Add/>New recipe
        </Fab>
    </div>
}

function RecipeCard({recipe, onPublish, onEdit, onDelete}) {
    return <ProductCard
        imageSrc={getFirstPhotoUrl(recipe.id)}
        name={recipe.name}
        visibility={recipe.visibility}
        onPublish={onPublish}
        onDelete={onDelete}
        onEdit={onEdit}/>
}

function getFirstPhotoUrl(id) {
    return `/api/recipes/${id}/photos/0`;
}
