import {Box, Button, Container, Grid, Paper, TextField, Typography} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import {grey} from "@mui/material/colors";
import {useReducer} from "react";
import {Error, signUp} from "../action/signup";
import Message from "../content/message";

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

    const submit = async (event) => {
        event.preventDefault();
        await handleSubmit(state, dispatch);
    }

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

async function handleSubmit(state, dispatch) {
    const {username, password} = state;

    dispatch('submitted');

    const result = await signUp(username, password);

    if (result.error === Error.USER_ALREADY_EXISTS)
        return dispatch({type: 'userAlreadyExists'});

    if (result.validationErrors) {
        return dispatch({type: 'validationFailed', payload: result.validationErrors});
    }

    window.location.href = "about:blank";
}

function reducer(state, event) {
    console.log(state, event);
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
