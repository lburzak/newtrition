import {render, screen} from '@testing-library/react';
import {SignUpPage} from './signup';
import userEvent from '@testing-library/user-event';
import {AuthContext} from "../App";
import Message from "../auth/message";

it('should redirect to homepage if authenticated', () => {
    const authState = {
        authenticated: true,
        token: "token",
        username: "username"
    };

    render(
        <AuthContext.Provider value={{
            authState, authDispatch: () => {
            }
        }}>
            <SignUpPage/>
        </AuthContext.Provider>
    )

    expect(window.location.pathname).toBe('/');
});

it('should show username error if username validation failed', () => {
    const authState = {
        authenticated: false
    }

    render(
        <AuthContext.Provider value={{
            authState, authDispatch: () => {
            }
        }}>
            <SignUpPage/>
        </AuthContext.Provider>
    );

    const validationError = {type: 'any.required', field: 'username'};

    jest.mock('../api/auth', () => ({
        ...jest.requireActual('../api/auth'),
        initiateSignUpFlow: async () => jest.requireActual('../api/result').failure(jest.requireActual('../api/auth').Error.VALIDATION_FAILED, {username: [validationError]})
    }));

    enterPassword('hello');
    submit();

    const expectedErrorText = Message.fromValidationError(validationError);
    expect(screen.getByDisplayValue(expectedErrorText)).toBeInTheDOM();
})

function enterUsername(username) {
    const usernameField = screen.getByTestId("username-field");
    userEvent.type(usernameField, username);
}

function enterPassword(password) {
    const passwordField = screen.getByTestId("password-field");
    userEvent.type(passwordField, password);
}

function submit() {
    const submitButton = screen.getByTestId("signup-button");
    userEvent.click(submitButton);
}
