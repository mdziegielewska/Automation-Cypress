/// <reference types="cypress"/>

import { AUTHORIZATION_SELECTORS } from '../selectors/authorizationSelectors';
import { NAVIGATION_SELECTORS } from '../selectors/navigationSelectors';
import { forms } from './forms';
import { routes } from "./routes";


class Authorization {

    /**
     * Fills in the email and password fields on a login form.
     * @param email The email address to type.
     * @param password The password to type.
     */
    fillLogInData(email: string, password: string): void {
        cy.log('Filling User Data');

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
    fillSignUpForm(fieldData: { field: string, value: string }[]): void {
        cy.log('Filling Sign Up Form Fields');

        for (const data of fieldData) {
            forms.fillField(data.field, data.value);
        }
    }

    /**
     * Performs a login attempt.
     * Assumes the test is already on the login page.
     * @param email The email to use for login.
     * @param password The password to use for login.
     */
    performLogInAttempt(email: string, password: string): void {
        cy.log(`Attempting Log In with ${email} and ${password}`);

        authorization.fillLogInData(email, password);

        routes.expect('LogInResult');
        forms.submit('login');

        cy.wait('@LogInResult');
    }

    /**
     * Logs in with the default user credentials and preserves the session cookie.
     */
    logInAndSetCookie(): void {
        cy.log('Logging In with default User');

        routes.visitAndWait('LogInPage');
        authorization.performLogInAttempt(Cypress.env("TEST_USER_EMAIL"), Cypress.env("TEST_USER_PASSWORD"));
       
        cy.preserveCookies("PHPSESSID");
    }

    /**
     * Clicks the customer welcome name element to open the user actions dropdown.
     * Assumes the element is part of the navigation and has the 'aria-expanded' attribute
     * to indicate its state.
     */
    openWelcomeUserTab(): void {
        cy.log('Opening Customer Actions');

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
        cy.log('Signing Out');

        cy.get(AUTHORIZATION_SELECTORS.signOut)
            .contains('Sign Out')
            .click();

        routes.expect('LogOut');
    }

    /**
     * Logs in an existing user using a session and sets a cookie for authentication.
     * This function ensures that the user is logged in by utilizing Cypress's session handling. It validates 
     * the session by checking the existence of the 'PHPSESSID' cookie. Once the login is successful, 
     * the `isLogged` variable is set to true.
     * @returns {boolean} - Returns `true` if the user is successfully logged in, otherwise `false`.
     */
    loginAsExistingUser(): boolean {
        let isLogged: boolean;

        cy.session('login', () => {
            this.logInAndSetCookie();
            isLogged = true;
        }, {
            validate() {
                cy.getCookie('PHPSESSID').should('exist');
            }
        });

        return isLogged;
    }
}

export const authorization = new Authorization();