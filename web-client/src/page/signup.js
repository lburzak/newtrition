import {Box, Button, Container, Grid, Paper, TextField, Typography} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import {grey} from "@mui/material/colors";
import {useContext, useEffect, useReducer} from "react";
import {Error, initiateSignUpFlow} from "../api/auth";
import Message from "../auth/message";
import {AuthContext} from "../App";
import {useNavigate} from "react-router";

const initialState = {
    usernameError: null,
    passwordError: null,
    username: "",
    password: "",
    submitted: false
}

export const SignUpPage = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {authState, authDispatch} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authState.authenticated)
            navigate('/');

        if (state.submitted)
            initiateSignUpFlow(state)
                .then(buildSignUpResultHandler(dispatch, authDispatch));
    })

    return <Container sx={{alignItems: "center", justifyContent: "center", height: "100vh", display: "flex"}}>
        <Paper elevation={2} style={{padding: 60}}>
            <AccountCircle sx={{color: grey[400], fontSize: 160}}/>
            <Typography variant={"h3"} style={{marginBottom: 40}}>Sign Up</Typography>
            <Box>
                <form onSubmit={e => {
                    e.preventDefault();
                    dispatch({type: 'submitted'});
                }}>
                    <Grid container spacing={2} maxWidth={300} sx={{border: "1px grey"}}>
                        <Grid item xs={12}>
                            <TextField data-testid={"username-field"} fullWidth label={"Username"} variant={"outlined"}
                                       error={state.usernameError !== null} helperText={state.usernameError}
                                       onChange={e => dispatch({type: 'usernameChanged', payload: e.target.value})}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField data-testid={"password-field"} fullWidth label={"Password"} variant={"outlined"}
                                       type={"password"}
                                       error={state.passwordError !== null} helperText={state.passwordError}
                                       onChange={e => dispatch({type: 'passwordChanged', payload: e.target.value})}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Button data-testid={"signup-button"} fullWidth variant={"contained"} type={"submit"}
                                    disabled={state.submitted}>Sign up</Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Paper>
    </Container>;
}

const buildSignUpResultHandler = (dispatch, authDispatch) => (result) => {
    if (result.isSuccess) {
        const {accessToken, username} = result.payload;
        return authDispatch({type: 'loggedIn', payload: {accessToken, username}});
    }

    switch (result.error) {
        case Error.USER_ALREADY_EXISTS:
            return dispatch({type: 'userAlreadyExists'});
        case Error.VALIDATION_FAILED:
            return dispatch({type: 'validationFailed', payload: result.payload});
        default:
            return console.error("Something went wrong.");
    }
}

function reducer(state, event) {
    switch (event.type) {
        case 'usernameChanged':
            return {...state, username: event.payload};
        case 'passwordChanged':
            return {...state, password: event.payload};
        case 'submitted':
            return {...state, submitted: true}
        case 'userAlreadyExists':
            return {
                ...state,
                usernameError: "User with such username already exists.",
                submitted: false
            };
        case 'validationFailed':
            const usernameErrors = event.payload.username;
            const passwordErrors = event.payload.password;

            return {
                ...state,
                usernameError: usernameErrors ? Message.fromValidationError(usernameErrors[0]) : null,
                passwordError: passwordErrors ? Message.fromValidationError(passwordErrors[0]) : null,
                submitted: false
            }
        default:
            return {...state}
    }
}
