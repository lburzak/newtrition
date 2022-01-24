import {Button, Link, TextField} from "@mui/material";
import {blue} from "@mui/material/colors";
import {useEffect, useReducer} from "react";
import {useNavigate} from "react-router";
import {PaperForm} from "../../component/PaperForm";
import {Row} from "../../component/Row";
import FormHeading from "../../component/FormHeading";
import {useClient} from "../../hook/client";

const initialState = {
    usernameError: null,
    passwordError: null,
    username: "",
    password: "",
    submitted: false
}

export const LoginPage = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const client = useClient();
    const navigate = useNavigate();

    useEffect(() => {
        if (client.isAuthenticated)
            navigate('/');

        if (state.submitted) {
            const {username, password} = state
            client.login({username, password})
        }
    })

    // noinspection HtmlUnknownTarget
    return <PaperForm heading={<FormHeading header={"Sign in"} iconColor={blue[400]}/>} onSubmit={() => dispatch({type: 'submitted'})}>
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

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Link href={"#"} onClick={() => navigate('/signup')}>Don't have an account yet?</Link>
            </div>
        </Row>
    </PaperForm>;
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
