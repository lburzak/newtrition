import {Button, Link, TextField} from "@mui/material";
import {useEffect, useReducer} from "react";
import Message from "../../form/message";
import {useNavigate} from "react-router";
import {PaperForm} from "../../component/PaperForm";
import {Row} from "../../component/Row";
import {grey} from "@mui/material/colors";
import FormHeading from "../../component/FormHeading";
import {useClient} from "../../hook/client";

const initialState = {
    usernameError: null,
    passwordError: null,
    username: "",
    password: "",
    submitted: false
}

export const SignUpPage = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();
    const client = useClient();

    useEffect(() => {
        if (client.isAuthenticated.authenticated)
            navigate('/');

        if (state.submitted)
            client.signup(state);
    })

    // noinspection HtmlUnknownTarget
    return <PaperForm heading={<FormHeading header={"Create an account"} iconColor={grey[400]}/>} onSubmit={() => dispatch({type: 'submitted'})}>
        <Row horizontalSpacing={2} maxWidth={600}>
            <TextField fullWidth label={"Username"} variant={"outlined"}
                       error={state.usernameError !== null} helperText={state.usernameError}
                       onChange={e => dispatch({type: 'usernameChanged', payload: e.target.value})}/>
            <TextField fullWidth label={"Password"} variant={"outlined"}
                       type={"password"}
                       error={state.passwordError !== null} helperText={state.passwordError}
                       onChange={e => dispatch({type: 'passwordChanged', payload: e.target.value})}/>
            <Button fullWidth variant={"contained"} type={"submit"}
                    disabled={state.submitted}>Sign up</Button>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Link href={"#"} onClick={() => navigate('/login')}>Already have an account?</Link>
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
