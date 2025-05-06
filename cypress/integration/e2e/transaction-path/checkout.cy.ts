/// <reference types="cypress"/>

import { authorization } from "../../helpers/authorization";
import { cart } from '../../helpers/cart';
import { checkout } from "../../helpers/checkout";
import { forms } from "../../helpers/forms";
import { generate } from "../../helpers/generate";
import { product } from "../../helpers/product";
import { results } from "../../helpers/results";
import { routes } from "../../helpers/routes";
import { CHECKOUT_SELECTORS } from "../../selectors/selectors";


let isLogged: boolean = false;

const CANCEL_COUPON_MESSAGE = 'You canceled the coupon code.';

const generatedEmail = `${generate.generateString()}@gmail.com`;

const shippingAddressParams = [
    { field: CHECKOUT_SELECTORS.emailAddressField, value: generatedEmail },
    { field: CHECKOUT_SELECTORS.firstNameField, value: Cypress.env("TEST_FIRST_NAME") },
    { field: CHECKOUT_SELECTORS.lastNameField, value: Cypress.env("TEST_LAST_NAME") },
    { field: CHECKOUT_SELECTORS.streetAddressField, value: Cypress.env("SHIPPING_ADDRESS") },
    { field: CHECKOUT_SELECTORS.cityField, value: Cypress.env("CITY") },
    { field: CHECKOUT_SELECTORS.zipPostalCodeField, value: '12345-6789' },
    { field: CHECKOUT_SELECTORS.phoneNumberField, value: Cypress.env("PHONE_NUMBER") }
];
const countryParams = [
    { field: CHECKOUT_SELECTORS.countryField, value: "United States" },
    { field: CHECKOUT_SELECTORS.stateProvinceField, value: "Alaska" }
]

const checkoutType = 'Checkout';
const couponList = [
    { couponCode: 'test123', type: 'Invalid' },
    { couponCode: 'h20', type: 'Valid' },
]

/**
 * Helper function to add a default product to the cart if it's empty and navigate to the checkout page.
 */
const addDefaultProductIfNeeded = () => {
    cart.isEmpty().then((isEmpty) => {
        if (isEmpty) {
            product.addDefaultProductToCart();
            product.addDefaultEquipmentProductToCart();
        }
    })
};

describe(`Transaction Path - ${checkoutType}`, () => {

    beforeEach(() => {

        switch(Cypress.currentTest.title) {
            case 'Should place an Order as a New User':
                cy.clearAllCookies();
                break;

            default:
                if (!isLogged) {
                    cy.session('login', () => {
                        authorization.logInAndSetCookie();
                        isLogged = true;
                    }, {
                        validate() {
                            cy.getCookie('PHPSESSID')
                                .should('exist');
                        }
                    });
                } 
        }

        addDefaultProductIfNeeded();
        routes.visitAndWait('CheckoutPage');
    })

    it('Should show all Elements', () => {
        checkout.shouldShowProgress('Shipping');
        checkout.verifyCheckoutElements('Shipping');
        checkout.verifyCheckoutElements('Order Item');

        checkout.shouldClickOnButton(CHECKOUT_SELECTORS.nextButton, 'Next');

        checkout.shouldShowProgress('Review & Payments');
        checkout.verifyCheckoutElements('Payments');
        checkout.verifyCheckoutElements('Order Item');
    })

    describe('Placing Order Verification', () => {
        it('Should place an Order as Logged In User', () => {
            checkout.shouldVerifyShippingSection();
            checkout.shouldClickOnButton(CHECKOUT_SELECTORS.nextButton, 'Next');
            checkout.shouldVerifyBillingSection();

            checkout.placeOrder();

            checkout.shouldVerifyThankYouPage();
            checkout.shouldClickOnButton(CHECKOUT_SELECTORS.continueButton, 'Continue Shopping');

            cy.expect('LoadPage');
            cy.url()
                .should('contain', '/');
        })

        it('Should place an Order as a New User', () => {
            forms.fillShippingData(shippingAddressParams, countryParams);
            checkout.shouldCheckShippingMethod(1);
            checkout.shouldClickOnButton(CHECKOUT_SELECTORS.nextButton, 'Next');
            checkout.shouldVerifyBillingSection();

            checkout.placeOrder();

            checkout.shouldVerifyThankYouPage();
            checkout.shouldClickOnButton(CHECKOUT_SELECTORS.createAccountButton, 'Create an Account');

            cy.expect('SignUpPage');
            cy.url()
                .should('contain', '/customer/account/create/');
        })
    })

    describe('Coupon Section Verification', () => {
        couponList.forEach(({ couponCode, type }) => {
            it(`Should apply ${type} Code`, () => {
                const COUPON_MESSAGE = (type === 'Invalid')
                    ? `The coupon code "${couponCode}" is not valid.`
                    : `You used coupon code "${couponCode}".`;

                cart.openCouponSection();
                cart.applyCoupon(couponCode);
                results.shouldVerifyPageMessage(COUPON_MESSAGE);

                if (type === 'Valid') {
                    cart.cancelCoupon();
                    results.shouldVerifyPageMessage(CANCEL_COUPON_MESSAGE);
                }
            })
        })
    })

    describe(`${checkoutType} Action Verification`, () => {
        it('Should add New Shipping Address at Checkout', () => {
            // to do
        })

        it('Should choose different Billing Address', () => {
            // to do
        })

        it('Should edit Ship To & Shipping Method', () => {
            // to do
        })
    })
})