/// <reference types="cypress"/>

import { forms } from '../../helpers/forms';
import { generate } from '../../helpers/generate';
import { results } from '../../helpers/results';
import { routes } from '../../helpers/routes';


const generateEmail = `${generate.generateString()}@gmail.com`;
const signUpParams = [
    { field: 'firstname', value: Cypress.env("TEST_FIRST_NAME") },
    { field: 'lastname', value: Cypress.env("TEST_LAST_NAME") },
    { field: 'email_address', value: generateEmail },
    { field: 'password', value: Cypress.env("TEST_USER_PASSWORD") },
    { field: 'password-confirmation', value: Cypress.env("TEST_USER_PASSWORD") }
];

const REGISTER_MESSAGE = `Thank you for registering with Main Website Store.`;
const EXISTING_EMAIL_MESSAGE = 'There is already an account with this email address.';
const PASSWORD_ERROR_MESSAGE = 'Minimum length of this field must be equal or greater than 8 symbols. Leading and trailing spaces will be ignored.';
const CONFIRM_PASSWORD_ERROR_MESSAGE = 'Please enter the same value again.';


describe('Sign Up', () => {

    const newCustomer = '.block-new-customer';
    const signUpPanel = '[data-ui-id="page-title-wrapper"]';

    it('Should sign up correctly', () => {

        cy.visit('/customer/account/login');

        results.shouldVerifyTextInSection(newCustomer, 'New Customers');
        cy.get('a.create')
            .click();

        routes.expect('SignUpPage');

        results.shouldVerifyTextInSection(signUpPanel, 'Create New Customer Account');

        for (const data of signUpParams) {
            forms.fillField(data.field, data.value);
        };

        forms.submit('submit');

        results.shouldVerifyPageMessage(REGISTER_MESSAGE);
        results.shouldVerifyTextInSection('.block-dashboard-info', `${generateEmail}`);
    })

    it('Should sign up with existing email address', () => {

        cy.visit('/customer/account/create/');

        routes.expect('SignUpPage');

        for (const data of signUpParams) {
            if (data.field === 'email_address') {
                data.value = `${Cypress.env("TEST_USER_EMAIL")}`;
            }

            forms.fillField(data.field, data.value);
        };

        forms.submit('submit');

        results.shouldVerifyPageMessage(EXISTING_EMAIL_MESSAGE);
    })

    it('Should sign up with incorrect password', () => {

        cy.visit('/customer/account/create/');

        routes.expect('SignUpPage');

        forms.fillField('password', 'test');
        forms.fillField('password-confirmation', '123');

        forms.submit('submit');

        results.shouldVerifyMageErrorMessage(PASSWORD_ERROR_MESSAGE);
        results.shouldVerifyMageErrorMessage(CONFIRM_PASSWORD_ERROR_MESSAGE);
    })
})