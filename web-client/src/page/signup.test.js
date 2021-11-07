import { render, screen } from '@testing-library/react';
import {SignUpPage} from './signup';
import userEvent from '@testing-library/user-event';

test('renders learn react link', () => {
    render(<SignUpPage />);
    const usernameField = screen.getByTestId("username-field");
    userEvent.type(usernameField, "a");
    const submitButton = screen.getByTestId("signup-button");
    userEvent.click(submitButton);
});
