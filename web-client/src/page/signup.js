import {Box, Button, Container, Grid, Paper, TextField} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import {grey} from "@mui/material/colors";

export const SignUpPage = () => <Container sx={{ alignItems: "center", justifyContent: "center", height: "100vh", display: "flex"}}>
    <Paper elevation={2} style={{padding: 60}}>
        <AccountCircle sx={{ color: grey[400], fontSize: 160 }} style={{marginBottom: 40}}/>
        <Box>
            <Grid container spacing={2} maxWidth={300} sx={{border: "1px grey"}}>
                <Grid item xs={12}>
                    <TextField fullWidth label={"Username"} variant={"outlined"}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label={"Password"} variant={"outlined"}/>
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth variant={"contained"}>Sign up</Button>
                </Grid>
            </Grid>
        </Box>
    </Paper>
</Container>