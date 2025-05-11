/// <reference types="cypress"/>

import { authorization } from "../../helpers/authorization";
import { checkout } from "../../helpers/checkout";
import { forms } from "../../helpers/forms";
import { generate } from "../../helpers/generate";
import { widgets } from "../../helpers/widgets";
import { CHECKOUT_SELECTORS } from '../../selectors/checkoutSelectors';


let isLogged: boolean = false;

const checkoutType = 'Checkout';
const generatedEmail = `${generate.generateString()}@gmail.com`;

const newAddressParams = {
    shippingAddressParams: [
        { field: CHECKOUT_SELECTORS.firstNameField, value: Cypress.env("TEST_FIRST_NAME") },
        { field: CHECKOUT_SELECTORS.lastNameField, value: Cypress.env("TEST_LAST_NAME") },
        { field: CHECKOUT_SELECTORS.streetAddressField, value: Cypress.env("SHIPPING_ADDRESS") },
        { field: CHECKOUT_SELECTORS.cityField, value: Cypress.env("CITY") },
        { field: CHECKOUT_SELECTORS.zipPostalCodeField, value: '12345-6789' },
        { field: CHECKOUT_SELECTORS.phoneNumberField, value: Cypress.env("PHONE_NUMBER") }
    ],
    countryParams: [
        { field: CHECKOUT_SELECTORS.countrySelect, value: "United States" },
        { field: CHECKOUT_SELECTORS.stateProvinceSelect, value: "Alaska" }
    ]
};

const couponList = [
    { couponCode: 'test123', type: 'Invalid' },
    { couponCode: '20poff', type: 'Valid' },
];

const shippingInfoBlock = ['Ship To', 'Shipping Method'];


describe(`Transaction Path - ${checkoutType}`, () => {

    beforeEach(() => {
        const testTitle = Cypress.currentTest.title;

        if (testTitle.includes('as a New User')) {
            cy.clearAllCookies();
            isLogged = false;
        } else {
            isLogged = authorization.loginAsExistingUser();
        }

        checkout.addDefaultProductIfNeeded();
    });

    it('Should show all Elements', () => {
        checkout.shouldShowProgress('Shipping');
        checkout.verifyCheckoutElements('Shipping');
        checkout.verifyCheckoutElements('Order Item');

        checkout.shouldClickOnButton(CHECKOUT_SELECTORS.nextStepButton, 'Next');

        checkout.shouldShowProgress('Review & Payments');
        checkout.verifyCheckoutElements('Payments');
        checkout.verifyCheckoutElements('Order Item');
    });

    describe('Placing Order Verification', () => {
        it('Should place an Order as Logged In User', () => {
            checkout.shouldVerifyShippingSection();
            checkout.shouldClickOnButton(CHECKOUT_SELECTORS.nextStepButton, 'Next');
            checkout.shouldVerifyBillingSection();

            checkout.completeOrderFlow('Checkout');
        });

        it('Should place an Order as a New User', () => {
            forms.fillField(CHECKOUT_SELECTORS.customerEmailField, generatedEmail);
            forms.fillShippingData(newAddressParams);

            checkout.shouldCheckShippingMethod(1);
            checkout.shouldClickOnButton(CHECKOUT_SELECTORS.nextStepButton, 'Next');
            checkout.shouldVerifyBillingSection();

            checkout.completeOrderFlow('Checkout', () => {
                cy.expect('SignUpPage');
                checkout.shouldClickOnButton(CHECKOUT_SELECTORS.createAccountButton, 'Create an Account');

                cy.url().should('contain', '/customer/account/create/');
            });
        });
    });

    describe('Coupon Section Verification', () => {
        couponList.forEach(({ couponCode, type }) => {
            it(`Should apply ${type} Code`, () => {
                checkout.shouldClickOnButton(CHECKOUT_SELECTORS.nextStepButton, 'Next');
                checkout.applyCouponAndVerify(couponCode, type);
            });
        });
    });

    describe(`${checkoutType} Action Verification`, () => {
        it('Should add New Shipping Address at Checkout', () => {
            checkout.getAddresses().then(($addresses) => {
                const initialAddressesCount = $addresses.length;

                widgets.shouldVerifyNumberOfElements(CHECKOUT_SELECTORS.shippingAddressItem, initialAddressesCount);

                checkout.shouldModalAppear();
                forms.fillShippingData(newAddressParams);
                checkout.shouldClickOnButton(CHECKOUT_SELECTORS.saveInAddressBookCheckbox, 'Save in address book');
                checkout.shouldClickOnButton(CHECKOUT_SELECTORS.shipHereButton, 'Ship here');
    
                checkout.verifyCountChange(CHECKOUT_SELECTORS.shippingAddressItem, initialAddressesCount, 1);
            });
        });

        it('Should choose different Billing Address', () => {
            checkout.shouldClickOnButton(CHECKOUT_SELECTORS.nextStepButton, 'Next');
            checkout.shouldClickOnButton(CHECKOUT_SELECTORS.billingSameAsShippingSection, 'My billing and shipping address are the same');

            checkout.getOptionList('Billing').then(($addresses) => {
                const initialAddressesCount = $addresses.length;

                checkout.selectAddress('Billing', initialAddressesCount - 2);
                checkout.updateAddressAndVerify();
            });
        });

        shippingInfoBlock.forEach((shippingInfo, index) => {
            it(`Should edit ${shippingInfo}`, () => {
                checkout.shouldClickOnButton(CHECKOUT_SELECTORS.nextStepButton, 'Next');
                checkout.clickOnEditButtons(index);
                checkout.shouldShowProgress('Shipping');

                cy.url().should('contain', 'checkout/#shipping');

                checkout.shouldVerifyShippingSection();
            });
        });
    });
});