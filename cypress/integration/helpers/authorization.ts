/// <reference types="cypress"/>

import { AUTHORIZATION_SELECTORS, NAVIGATION_SELECTORS } from '../selectors/selectors';
import { forms } from './forms';
import { routes } from "./routes";


class Authorization {

    /**
     * Fills in the email and password fields on a login form.
     * @param email The email address to type.
     * @param password The password to type.
     */
    fillLogInData(email: string, password: string): void {
        cy.log('Filling in user data');

        cy.get(AUTHORIZATION_SELECTORS.logInInput)
            .should('have.attr', 'aria-required', 'true')
            .type(email);

        cy.get(AUTHORIZATION_SELECTORS.passwordInput)
            .should('have.attr', 'aria-required', 'true')
            .type(password);
    }

    /**
     * Helper function to fill specified fields on the sign-up form.
     * Assumes the test is already on the sign-up page.
     * @param fieldData An array of objects with 'field' and 'value' properties.
     */
    fillSignUpForm(fieldData: { field: string, value: string }[]) {
        cy.log('Filling sign up form fields');

        for (const data of fieldData) {
            forms.fillField(data.field, data.value);
        }
    };

    /**
     * Performs a login attempt.
     * Assumes the test is already on the login page.
     * @param email The email to use for login.
     * @param password The password to use for login.
     */
    performLoginAttempt(email: string, password: string): void {
        cy.log(`Attempting ${email} login`);

        authorization.fillLogInData(email, password);

        routes.expect('LogInResult');
        forms.submit('login');

        cy.wait('@LogInResult');
    };

    /**
     * Clicks the customer welcome name element to open the user actions dropdown.
     * Assumes the element is part of the navigation and has the 'aria-expanded' attribute
     * to indicate its state.
     */
    openWelcomeUserTab(): void {
        cy.log('Opening customer actions');

        cy.get(NAVIGATION_SELECTORS.welcomeUserTab)
            .first()
            .should('have.attr', 'aria-expanded', 'false')
            .click()
            .should('have.attr', 'aria-expanded', 'true');
    }

    /**
     * Clicks the 'Sign Out' link to log the currently authenticated user out.
     * Expects the 'LogOut' route to be triggered after clicking, indicating successful logout.
     */
    signOut(): void {
        cy.log('Signing out');

        cy.get(AUTHORIZATION_SELECTORS.signOut)
            .contains('Sign Out')
            .click();

        routes.expect('LogOut');
    }
}

export const authorization = new Authorization();