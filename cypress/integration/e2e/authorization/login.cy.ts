/// <reference types="cypress"/>

import { authorization } from '../../helpers/authorization';
import { forms } from '../../helpers/forms';
import { results } from '../../helpers/results';
import { routes } from '../../helpers/routes';

const LOGIN_ERROR_MESSAGE = "The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.";
const RESET_PASSWORD_MESSAGE = `If there is an account associated with ${Cypress.env("TEST_USER_EMAIL")} you will receive an email with a link to reset your password.`;


describe('Log in', () => {
    beforeEach(() => {
        cy.clearAllCookies();
        cy.visit('/');
    })

    const headerPanelLinks = 'li.authorization-link a';
    const loginPanel = '[data-ui-id="page-title-wrapper"]';
    const resetPanel = '.action.remind';

    it('Should log in correctly', () => {
        cy.get(headerPanelLinks)
            .first()
            .click();
            
        results.shouldVerifyTextInSection(loginPanel, 'Customer Login');

        authorization.fillInlogInData(Cypress.env("TEST_USER_EMAIL"), Cypress.env("TEST_USER_PASSWORD"));
        forms.submit('login');

        routes.expect('LoadPage');

        results.shouldVerifyTextInSection('li.greet.welcome', `Welcome, ${Cypress.env("TEST_FULL_NAME")}!`);
    })

    it('Should log in incorrectly', () => {
        cy.get(headerPanelLinks)
            .first()
            .click();
        
        results.shouldVerifyTextInSection(loginPanel, 'Customer Login');
        
        authorization.fillInlogInData(Cypress.env("TEST_USER_EMAIL"), "123456789");
        forms.submit('login');

        results.shouldVerifyAlert(LOGIN_ERROR_MESSAGE);
    })

    it('Should remind password', () => {
        cy.visit('/customer/account/login/');

        cy.get(resetPanel)
            .should('contain.text', 'Forgot Your Password?')
            .click();

        routes.expect('ResetPassword');

        forms.fillField('#email_address', `${Cypress.env("TEST_USER_EMAIL")}`);
        forms.submit('submit');

        results.shouldVerifyAlert(RESET_PASSWORD_MESSAGE);
    })
})