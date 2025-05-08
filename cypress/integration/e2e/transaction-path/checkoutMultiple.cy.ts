/// <reference types="cypress"/>

import { authorization } from "../../helpers/authorization";
import { cart } from "../../helpers/cart";
import { checkout } from "../../helpers/checkout";
import { product } from "../../helpers/product";
import { results } from "../../helpers/results";
import { routes } from "../../helpers/routes";
import { CHECKOUT_SELECTORS } from "../../selectors/selectors";


let isLogged: boolean = false;

const checkoutType = 'Checkout Multiple';

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
        switch (Cypress.currentTest.title) {
            case 'Should redirect to Log In Page when not Logged':
                cy.clearAllCookies();
                isLogged = false;
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
                break;
        }

        addDefaultProductIfNeeded();
        routes.visitAndWait('MultiShippingPage');
    })

    describe(`${checkoutType} Element Verification`, () => {
        it('Should show all Elements', () => {
            results.shouldVerifyPageTitle('Ship to Multiple Addresses');

            checkout.verifyMultipleAddressesCheckoutElements('Addresses');
            checkout.verifyMultipleAddressesTable();

            // to do verifying /multishipping/checkout/shipping/
            checkout.shouldClickOnButton(CHECKOUT_SELECTORS.continueButton, 'Go to Shipping Information');

            results.shouldVerifyPageTitle('Select Shipping Method');

            // to do verifying shipping page
            // go to billing info 
            // to do verifying billing page
            // go to review your order
            // to do verifying review order page
        })
    })

    describe('Placing Order Verification', () => {
        it('Should place an Order as Logged In User', () => {
            // to do verifying urls for each page
        })

        it('Should redirect to Log In Page when not Logged', () => {
            routes.expect('LogInRedirectPage');
            checkout.shouldClickOnButton(CHECKOUT_SELECTORS.multiCheckoutButton, 'Check Out with Multiple Addresses');
            cy.wait('@LogInRedirectPage');

            cy.url()
                .should('contain', '/multishipping/checkout/login/');
        })
    })

    describe('Checkout Action Verification', () => {
        // todo
    })
})