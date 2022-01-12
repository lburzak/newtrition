import {useRemoteData} from "../hook/remoteData";
import {useContext} from "react";
import {NewtritionClientContext} from "../App";
import {DataGrid} from '@mui/x-data-grid';
import {Button} from "@mui/material";
import {Close, Done, Visibility} from "@mui/icons-material";
import {useNavigate} from "react-router";

export default function RecipesWaitlistPage() {
    const navigate = useNavigate()
    const client = useContext(NewtritionClientContext);
    const [recipes, invalidate] = useRemoteData(() => client.recipes.get({visibility: 'waitlist'}), [])

    function acceptRecipe(id) {
        client.recipes.byId(id).patch({visibility: 'public'})
            .then(invalidate);
    }

    function declineRecipe(id) {
        client.recipes.byId(id).patch({visibility: 'private'})
            .then(invalidate);
    }

    function showRecipe(id) {
        navigate(`/recipes/${id}`)
    }

    function ActionsCell({recipeId}) {
        return <div style={{width: '100%', display: 'flex'}}>
            <Button onClick={() => showRecipe(recipeId)} style={{flex: 1}} fullWidth color={"info"}><Visibility/></Button>
            <Button onClick={() => acceptRecipe(recipeId)} style={{flex: 1}} fullWidth color={"success"}><Done/></Button>
            <Button onClick={() => declineRecipe(recipeId)} style={{flex: 1}} fullWidth color={"error"}><Close/></Button>
        </div>
    }

    const columns = [
        { field: 'id', headerName: 'Id', flex: 1 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'owner', headerName: 'Author', flex: 1 },
        { field: 'action', headerName: 'Action', flex: 1, renderCell: ({row}) => <ActionsCell recipeId={row.id}/> }
    ];

    return <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ flexGrow: 1 }}>
            <DataGrid rows={recipes.map(recipe => {
                recipe.id = recipe._id
                return recipe
            })} columns={columns}/>
        </div>
    </div>
}
