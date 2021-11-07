import {Box, Button, Container, Grid, Paper, TextField, Typography} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import {grey} from "@mui/material/colors";
import {Component} from "react";
import {Error, signUp} from "../action/signup";
import Message from "../content/message";

export class SignUpPage extends Component {
    state = {
        usernameError: null,
        passwordError: null,
        username: "",
        password: "",
        loading: false
    }

    render() {
        return <Container sx={{alignItems: "center", justifyContent: "center", height: "100vh", display: "flex"}}>
            <Paper elevation={2} style={{padding: 60}}>
                <AccountCircle sx={{color: grey[400], fontSize: 160}}/>
                <Typography variant={"h3"} style={{marginBottom: 40}}>Sign Up</Typography>
                <Box>
                    <form onSubmit={this.submit}>
                        <Grid container spacing={2} maxWidth={300} sx={{border: "1px grey"}}>
                            <Grid item xs={12}>
                                <TextField data-testid={"username-field"} fullWidth label={"Username"} variant={"outlined"}
                                           error={this.state.usernameError !== null} helperText={this.state.usernameError}
                                           onChange={this.handleUsernameChange} onSubmit={this.submit}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField data-testid={"password-field"} fullWidth label={"Password"} variant={"outlined"}
                                           type={"password"}
                                           error={this.state.passwordError !== null} helperText={this.state.passwordError}
                                           onChange={this.handlePasswordChange} onSubmit={this.submit}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Button data-testid={"signup-button"} fullWidth variant={"contained"} type={"submit"}
                                        disabled={this.state.loading}>Sign up</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Paper>
        </Container>;
    }

    handlePasswordChange = (event) => {
        this.setState({
            ...this.state,
            password: event.target.value
        });
    }

    handleUsernameChange = (event) => {
        this.setState({
            ...this.state,
            username: event.target.value
        });
    }

    submit = async (event) => {
        event.preventDefault();

        const {username, password} = this.state;

        this.setState({
            ...this.state,
            loading: true
        });

        const result = await signUp(username, password);

        if (result.error === Error.USER_ALREADY_EXISTS) {
            return this.setState({
                ...this.state,
                usernameError: "User with such username already exists.",
                loading: false
            });
        }

        if (result.validationErrors) {
            const usernameErrors = result.validationErrors.username;
            const passwordErrors = result.validationErrors.password;

            this.setState({
                ...this.state,
                usernameError: usernameErrors ? Message.fromValidationError(usernameErrors[0]) : null,
                passwordError: passwordErrors ? Message.fromValidationError(passwordErrors[0]) : null,
                loading: false
            });

            return;
        }

        window.location.href = "about:blank";
    }
}