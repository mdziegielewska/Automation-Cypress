/// <reference types="cypress"/>

import { authorization } from '../../helpers/authorization';
import { forms } from '../../helpers/forms';
import { generate } from '../../helpers/generate';
import { results } from '../../helpers/results';
import { routes } from '../../helpers/routes';
import { AUTHORIZATION_SELECTORS } from '../../selectors/selectors';


const REGISTER_MESSAGE = `Thank you for registering with Main Website Store.`;
const EXISTING_EMAIL_MESSAGE = 'There is already an account with this email address.';
const PASSWORD_ERROR_MESSAGE = 'Minimum length of this field must be equal or greater than 8 symbols. Leading and trailing spaces will be ignored.';
const CONFIRM_PASSWORD_ERROR_MESSAGE = 'Please enter the same value again.';

const generatedEmail = `${generate.generateString()}@gmail.com`;
const signUpParams = [
    { field: AUTHORIZATION_SELECTORS.firstNameField, value: Cypress.env("TEST_FIRST_NAME") },
    { field: AUTHORIZATION_SELECTORS.lastNameField, value: Cypress.env("TEST_LAST_NAME") },
    { field: AUTHORIZATION_SELECTORS.emailAddressField, value: generatedEmail },
    { field: AUTHORIZATION_SELECTORS.passwordField, value: Cypress.env("TEST_USER_PASSWORD") },
    { field: AUTHORIZATION_SELECTORS.passwordConfirmationField, value: Cypress.env("TEST_USER_PASSWORD") }
];

/**
 * Helper function to visit the sign-up page and verify its title.
 */
const goToSignUpPageAndVerify = () => {
    cy.clearAllCookies();

    routes.visitAndWait('SignUpPage');
    results.shouldVerifyTextInSection(AUTHORIZATION_SELECTORS.authotizationPanel, 'Create New Customer Account');
};


describe('Authorization - Sign Up', () => {

    beforeEach(() => {
        goToSignUpPageAndVerify();
    })

    it('Should sign up correctly', () => {
        authorization.fillSignUpForm(signUpParams);

        routes.expect('SignUpResult');
        forms.submit('submit');
        cy.wait('@SignUpResult');

        results.shouldVerifyPageMessage(REGISTER_MESSAGE);
        results.shouldVerifyTextInSection(AUTHORIZATION_SELECTORS.dashboardInfoBlock, `${generatedEmail}`);
    })

    it('Should sign up with existing email address', () => {
        const existingEmailSignUpParams = signUpParams.map(param => ({ ...param }));

        const emailParam = existingEmailSignUpParams.find(param => param.field === AUTHORIZATION_SELECTORS.emailAddressField);
        if (emailParam) {
            emailParam.value = Cypress.env("TEST_USER_EMAIL");
        }

        authorization.fillSignUpForm(existingEmailSignUpParams);

        routes.expect('SignUpResult');
        forms.submit('submit');
        cy.wait('@SignUpResult');

        results.shouldVerifyPageMessage(EXISTING_EMAIL_MESSAGE);
    })

    it('Should sign up with incorrect password', () => {
        forms.fillField(AUTHORIZATION_SELECTORS.passwordField, 'test');
        forms.fillField(AUTHORIZATION_SELECTORS.passwordConfirmationField, '123');

        forms.submit('submit');

        results.shouldVerifyMageErrorMessage(PASSWORD_ERROR_MESSAGE);
        results.shouldVerifyMageErrorMessage(CONFIRM_PASSWORD_ERROR_MESSAGE);
    })
})