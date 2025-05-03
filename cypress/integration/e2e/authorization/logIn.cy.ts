/// <reference types="cypress"/>

import { authorization } from '../../helpers/authorization';
import { forms } from '../../helpers/forms';
import { results } from '../../helpers/results';
import { routes } from '../../helpers/routes';
import { AUTHORIZATION_SELECTORS } from '../../selectors/selectors';


const LOGIN_SUCCESS_MESSAGE = `Welcome, ${Cypress.env("TEST_FIRST_NAME")} ${Cypress.env("TEST_LAST_NAME")}!`;
const LOGIN_ERROR_MESSAGE = "The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.";
const PASSWORD_RESET_MESSAGE = `If there is an account associated with ${Cypress.env("TEST_USER_EMAIL")} you will receive an email with a link to reset your password.`;

const loginTestCases = [
    {
        name: 'successful',
        email: Cypress.env("TEST_USER_EMAIL"),
        password: Cypress.env("TEST_USER_PASSWORD"),
        messageSelector: AUTHORIZATION_SELECTORS.greetMessage,
        expectedMessage: LOGIN_SUCCESS_MESSAGE
    },
    {
        name: 'unsuccessful',
        email: Cypress.env("TEST_USER_EMAIL"),
        password: "123456789",
        expectedMessage: LOGIN_ERROR_MESSAGE,
    },
];

/**
 * Helper function to clear cookies, visit the login page, and verify the title.
 */
const goToLoginPageAndVerify = () => {
    cy.clearAllCookies();

    routes.visitAndWait('LogInPage');
    results.shouldVerifyTextInSection(AUTHORIZATION_SELECTORS.authotizationPanel, 'Customer Login');
};


describe('Authorization', () => {

    beforeEach(() => {
        goToLoginPageAndVerify();
    });

    it('Should redirect to Sign Up Page', () => {
        results.shouldVerifyTextInSection(AUTHORIZATION_SELECTORS.newCustomer, 'New Customers');

        routes.expect('SignUpPage');
        cy.get(AUTHORIZATION_SELECTORS.createAccountLink)
            .click();

        cy.wait('@SignUpPage');
    })

    it('Should Log Out', () => {
        authorization.performLogInAttempt(Cypress.env("TEST_USER_EMAIL"), Cypress.env("TEST_USER_PASSWORD"));

        results.shouldVerifyTextInSection(AUTHORIZATION_SELECTORS.greetMessage, LOGIN_SUCCESS_MESSAGE);

        authorization.openWelcomeUserTab();
        routes.expect('LogOut');
        authorization.signOut();
        cy.wait('@LogOut');

        cy.url()
            .should('include', '/');
    });

    describe('Login Page Verification', () => {
        it('Should Remind Password', () => {
            routes.expect('ForgotPasswordPage');

            cy.get(AUTHORIZATION_SELECTORS.resetPanel)
                .should('be.visible')
                .and('contain.text', 'Forgot Your Password?')
                .click();

            cy.wait('@ForgotPasswordPage');
            cy.url()
                .should('include', '/customer/account/forgotpassword/');

            routes.expect('ResetPasswordResult');

            forms.fillField('email_address', `${Cypress.env("TEST_USER_EMAIL")}`);
            forms.submit('submit');

            cy.wait('@ResetPasswordResult');

            results.shouldVerifyPageMessage(PASSWORD_RESET_MESSAGE);
        });

        loginTestCases.forEach((testCase) => {
            it(`Should handle ${testCase.name} login attempt`, () => {
                authorization.performLogInAttempt(testCase.email, testCase.password);

                if (testCase.name === 'successful') {
                    results.shouldVerifyTextInSection(testCase.messageSelector, testCase.expectedMessage);

                    cy.url()
                        .should('include', '/customer/account/');
                } else {
                    results.shouldVerifyPageMessage(testCase.expectedMessage);

                    cy.url()
                        .should('include', '/customer/account/login/');
                }
            });
        });
    });
});