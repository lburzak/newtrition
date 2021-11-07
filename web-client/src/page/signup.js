import {Box, Button, Container, Grid, Paper, TextField, Typography} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import {grey} from "@mui/material/colors";
import {Component} from "react";
import {Error, signUp} from "../action/signup";

const values = {
    'username': {
        'string.min': 2,
        'string.max': 40,
    },
    'password': {
        'string.min': 5,
        'string.max': 64
    }
};

function buildFieldErrorMessage(error) {
    const field = error.field.charAt(0).toUpperCase() + error.field.slice(1);
    const type = error.type;
    const value = values[error.field][error.type];

    switch (error.type) {
        case "string.min":
            return `${field} must be at least ${value} characters long.`;
        case "string.max":
            return `${field} must be at most ${value} characters long.`;
        case "any.required":
        case "string.empty":
            return `${field} cannot be empty.`;
        case "string.pattern.base":
            return `${field} contains illegal characters.`
        default:
            return type
    }
}

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
                    <Grid container spacing={2} maxWidth={300} sx={{border: "1px grey"}}>
                        <Grid item xs={12}>
                            <TextField data-testid={"username-field"} fullWidth label={"Username"} variant={"outlined"}
                                       error={this.state.usernameError !== null} helperText={this.state.usernameError}
                                       onChange={this.handleUsernameChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField data-testid={"password-field"} fullWidth label={"Password"} variant={"outlined"}
                                       type={"password"}
                                       error={this.state.passwordError !== null} helperText={this.state.passwordError}
                                       onChange={this.handlePasswordChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Button data-testid={"signup-button"} fullWidth variant={"contained"} onClick={this.submit}
                                    disabled={this.state.loading}>Sign up</Button>
                        </Grid>
                    </Grid>
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

    submit = async () => {
        const {username, password} = this.state;

        this.setState({
            ...this.state,
            loading: true
        });

        const result = await signUp(username, password);

        if (result.error === Error.USER_ALREADY_EXISTS) {
            this.state.usernameError = "User with such username already exists.";

            this.setState({...this.state, loading: false});
            return;
        }

        if (result.validationErrors) {
            const usernameErrors = result.validationErrors.username;
            const passwordErrors = result.validationErrors.password;

            this.state.usernameError = usernameErrors ?
                buildFieldErrorMessage(result.validationErrors.username[0]) : null;

            this.state.passwordError = passwordErrors ?
                buildFieldErrorMessage(result.validationErrors.password[0]) : null;

            this.setState({...this.state, loading: false});
            return;
        }

        window.location.href = "about:blank";
    }
}