import {Typography} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";

const FormHeading = ({iconColor, header}) => <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <AccountCircle sx={{color: iconColor, fontSize: 160}}/>
    <Typography variant={"h3"} style={{marginBottom: 40}}>{header}</Typography>
</div>

export default FormHeading;