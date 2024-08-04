/// <reference types="cypress"/>

import { authorization } from '../../helpers/authorization';
import { forms } from '../../helpers/forms';
import { results } from '../../helpers/results';


describe('Log in', () => {
    beforeEach(() => {
        cy.clearAllCookies();
        cy.visit('/');
    })

    let headerPanelLinks = 'li.authorization-link a';
    let loginPanel = '[data-ui-id="page-title-wrapper"]';

    it('Should log in correctly', () => {
        cy.get(headerPanelLinks)
            .first()
            .click();
            
        results.shouldVerifyTextInSection(loginPanel, 'Customer Login');

        authorization.fillInlogInData(Cypress.env("TEST_USER_EMAIL"), Cypress.env("TEST_USER_PASSWORD"));
        forms.submit();

        results.shouldVerifyTextInSection('li.greet.welcome', `Welcome, ${Cypress.env("TEST_FULL_NAME")}!`);
    })


    it('Should log in incorrectly', () => {
        cy.get(headerPanelLinks)
            .first()
            .click();
        
        results.shouldVerifyTextInSection(loginPanel, 'Customer Login');
        
        authorization.fillInlogInData(Cypress.env("TEST_USER_EMAIL"), "123456789");
        forms.submit();

        results.shouldVerifyAlert(Cypress.env("LOGIN_ERROR"));
    })
})