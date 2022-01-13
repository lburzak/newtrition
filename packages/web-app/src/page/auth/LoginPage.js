import {Button, TextField, Typography} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import {blue} from "@mui/material/colors";
import {useContext, useEffect, useReducer} from "react";
import {AuthContext, NewtritionClientContext} from "../../App";
import {useNavigate} from "react-router";
import {PaperForm} from "../../component/PaperForm";
import {Row} from "../../component/Row";
import {AuthApi} from "../../api";

const initialState = {
    usernameError: null,
    passwordError: null,
    username: "",
    password: "",
    submitted: false
}

const Heading = () => <div>
    <AccountCircle sx={{color: blue[400], fontSize: 160}}/>
    <Typography variant={"h3"} style={{marginBottom: 40}}>Sign In</Typography>
</div>

export const LoginPage = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {authState, authDispatch} = useContext(AuthContext);
    const client = useContext(NewtritionClientContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authState.authenticated)
            navigate('/');

        if (state.submitted)
            AuthApi.Endpoint.initiateLoginFlow(state)
                .then(buildLoginResultHandler(dispatch, authDispatch, client));
    })

    // noinspection HtmlUnknownTarget
    return <PaperForm heading={<Heading/>} onSubmit={() => dispatch({type: 'submitted'})}>
        <Row horizontalSpacing={2} maxWidth={600}>
            <TextField fullWidth label={"Username"} variant={"outlined"}
                       error={state.usernameError !== null} helperText={state.usernameError}
                       onChange={e => dispatch({type: 'usernameChanged', payload: e.target.value})}/>
            <TextField fullWidth label={"Password"} variant={"outlined"}
                       type={"password"}
                       error={state.passwordError !== null} helperText={state.passwordError}
                       onChange={e => dispatch({type: 'passwordChanged', payload: e.target.value})}/>
            <Button fullWidth variant={"contained"} type={"submit"}
                    disabled={state.submitted}>Sign in</Button>
            <a href="/signup">Don't have an account yet?</a>
        </Row>
    </PaperForm>;
}

const buildLoginResultHandler = (dispatch, authDispatch, client) => (result) => {
    if (result.isSuccess) {
        const {accessToken, username} = result.payload;

        client.users.self.get().then((res) => authDispatch({type: 'profileFetched', payload: {admin: res.data.admin}}))

        return authDispatch({type: 'loggedIn', payload: {accessToken, username}});
    }

    if (result.isFailure) {
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
        default:
            return {...state}
    }
}
