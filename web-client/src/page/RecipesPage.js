import {Add} from "@mui/icons-material";
import {Fab} from "@mui/material";
import {useNavigate} from "react-router";

export function RecipesPage() {
    const navigate = useNavigate();

    return <div>
        <Fab color={'primary'} variant={"extended"} sx={{mr: 1}}
             style={{position: 'absolute', right: 20, bottom: 20}} onClick={() => navigate('/recipes/new')}>
            <Add/>New recipe
        </Fab>
    </div>
}