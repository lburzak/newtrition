import {Box, Container, Paper} from "@mui/material";

export const PaperForm = ({onSubmit, heading, children}) =>
    <Container sx={{alignItems: "center", justifyContent: "center", height: "100vh", display: "flex"}}>
    <Paper elevation={2} style={{padding: 60}}>
        {heading}
        <Box>
            <form onSubmit={e => {
                e.preventDefault();
                onSubmit();
            }}>
                {children}
            </form>
        </Box>
    </Paper>
</Container>