import {Box, Button, Container, Grid, Paper, TextField, Typography} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import {grey} from "@mui/material/colors";
import {useContext, useEffect, useReducer} from "react";
import {Error, initiateSignUpFlow} from "../action/api";
import Message from "../content/message";
import {AuthContext} from "../App";

const initialState = {
    usernameError: null,
    passwordError: null,
    username: "",
    password: "",
    loading: false
}

export const SignUpPage = () => {
    const reducerHook = useReducer(reducer, initialState);
    const [state, dispatch] = reducerHook;
    const {authState, authDispatch} = useContext(AuthContext);

    const submit = async (event) => {
        event.preventDefault();
        await handleSubmit(state, dispatch, authDispatch);
    }

    useEffect(() => {
        if (authState.authenticated)
            window.location.href = "/";
    })

    return <Container sx={{alignItems: "center", justifyContent: "center", height: "100vh", display: "flex"}}>
        <Paper elevation={2} style={{padding: 60}}>
            <AccountCircle sx={{color: grey[400], fontSize: 160}}/>
            <Typography variant={"h3"} style={{marginBottom: 40}}>Sign Up</Typography>
            <Box>
                <form onSubmit={submit}>
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
                                    disabled={state.loading}>Sign up</Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Paper>
    </Container>;
}

async function handleSubmit(state, dispatch, authDispatch) {
    const {username, password} = state;

    dispatch('submitted');

    const flowResult = await initiateSignUpFlow({username, password});

    if (flowResult.isSuccess) {
        const {accessToken, username} = flowResult.payload;
        return authDispatch({type: 'loggedIn', payload: {accessToken, username}});
    }

    switch (flowResult.error) {
        case Error.USER_ALREADY_EXISTS:
            return dispatch({type: 'userAlreadyExists'});
        case Error.VALIDATION_FAILED:
            return dispatch({type: 'validationFailed', payload: flowResult.payload});
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
            return {...state, loading: true}
        case 'userAlreadyExists':
            return {
                ...state,
                usernameError: "User with such username already exists.",
                loading: false
            };
        case 'validationFailed':
            const usernameErrors = event.payload.username;
            const passwordErrors = event.payload.password;

            return {
                ...state,
                usernameError: usernameErrors ? Message.fromValidationError(usernameErrors[0]) : null,
                passwordError: passwordErrors ? Message.fromValidationError(passwordErrors[0]) : null,
                loading: false
            }
        default:
            return {...state}
    }
}
