import {Add} from "@mui/icons-material";
import {IconButton} from "@mui/material";

export default function PhotosSlider() {
    return <IconButton style={{
        borderRadius: 8,
        backgroundColor: 'hsl(0, 0%, 90%)',
        width: 120,
        height: 120,
        display: 'flex',
        justifyContent: 'center',
        alightItems: 'center'
    }}>
        <Add style={{color: 'hsl(0, 0%, 70%)'}} sx={{fontSize: 42}}/>
    </IconButton>
}