/// <reference types="cypress"/>

import { authorization } from "../../helpers/authorization";
import { cart } from "../../helpers/cart";
import { checkout } from '../../helpers/checkout';
import { forms } from "../../helpers/forms";
import { product } from "../../helpers/product";
import { results } from "../../helpers/results";
import { routes } from "../../helpers/routes";
import { widgets } from "../../helpers/widgets";
import { CART_SELECTORS } from "../../selectors/cartSelectors";
import { CHECKOUT_SELECTORS } from "../../selectors/checkoutSelectors";


let isLogged: boolean = false;

const SAVE_NEW_ADDRESS_MESSAGE = "You saved the address.";
const checkoutType = 'Checkout Multiple';

const shippingAddressParams = [
    { field: CHECKOUT_SELECTORS.newStreetAddress, value: Cypress.env("SHIPPING_ADDRESS") },
    { field: CHECKOUT_SELECTORS.cityField, value: Cypress.env("CITY") },
    { field: CHECKOUT_SELECTORS.zipPostalCodeField, value: '12345-6789' },
    { field: CHECKOUT_SELECTORS.phoneNumberField, value: Cypress.env("PHONE_NUMBER") }
];

const countryParams = [
    { field: CHECKOUT_SELECTORS.countryField, value: "United States" },
    { field: CHECKOUT_SELECTORS.stateProvinceField, value: "Alaska" }
];

const checkoutSteps = [
    {
        pageTitle: 'Ship to Multiple Addresses',
        elementType: 'Addresses',
        buttonText: 'Go to Shipping Information',
        expectedRouteAlias: 'MultiShippingPage'
    },
    {
        pageTitle: 'Select Shipping Method',
        elementType: 'Shipping',
        buttonText: 'Continue to Billing Information',
        expectedRouteAlias: 'MultiShippingMethodPage'
    },
    {
        pageTitle: 'Billing Information',
        elementType: 'Payments',
        buttonText: 'Go to Review Your Order',
        expectedRouteAlias: 'MultiShippingBillingPage'
    },
    {
        pageTitle: 'Review Order',
        elementType: 'Review',
        buttonText: null,
        expectedRouteAlias: 'MultiShippingOverviewPage'
    }
];

/**
 * Helper function to add a default product to the cart if it's empty and navigate to the checkout page.
 */
const addDefaultProductIfNeeded = () => {
    cart.isEmpty().then((isEmpty) => {
        if (isEmpty) {
            product.addDefaultProductToCart();
            product.addDefaultEquipmentProductToCart();
        }
    });
};

/**
 * Helper function to navigate to the multi-shipping checkout page from the cart.
 * It handles visiting the cart and clicking the multi-checkout button, then waits for the destination page.
 */
const redirectToMultiCheckout = () => {
    routes.visitAndWait('CartPage');

    routes.expect('MultiShippingPage');
    checkout.shouldClickOnButton(CHECKOUT_SELECTORS.multiCheckoutButton, 'Check Out with Multiple Addresses');
}


describe(`Transaction Path - ${checkoutType}`, () => {

    beforeEach(() => {
        let testTitle = Cypress.currentTest.title;
        cy.log(isLogged.toString());

        if (testTitle === 'Should redirect to Log In Page when not Logged') {
            cy.clearAllCookies();
            isLogged = false;
        } else {
            cy.session('login', () => {
                authorization.logInAndSetCookie();
                isLogged = true;
            }, {
                validate() {
                    cy.getCookie('PHPSESSID').should('exist');
                }
            });
        }
        addDefaultProductIfNeeded();
    });

    describe('Placing Order Verification', () => {
        it('Should place an Order as Logged In User and verify all Checkout Elements', () => {
            redirectToMultiCheckout();

            for (const step of checkoutSteps) {
                results.shouldVerifyPageTitle(step.pageTitle);
                checkout.verifyMultipleAddressesCheckoutElements(step.elementType as 'Addresses' | 'Shipping' | 'Payments' | 'Review');

                if (step.buttonText) {
                    if (step.elementType === 'Addresses' || step.elementType === 'Shipping') {
                        checkout.goToNextSection(step.elementType);

                    } else {
                        routes.expect(step.expectedRouteAlias);
                        checkout.shouldClickOnButton(CHECKOUT_SELECTORS.continueButton, step.buttonText);
                    }
                }
            }
            checkout.placeOrder('Multicheckout');
        });

        it('Should redirect to Log In Page when not Logged', () => {
            routes.visitAndWait('CartPage');

            routes.expect('LogInRedirectPage');
            checkout.shouldClickOnButton(CHECKOUT_SELECTORS.multiCheckoutButton, 'Check Out with Multiple Addresses');
            cy.wait('@LogInRedirectPage');

            cy.url().should('contain', '/multishipping/checkout/login/');
        });
    });

    describe('Checkout Action Verification', () => {
        describe('Addresses Page Action Verification', () => {

            beforeEach(() => {
                redirectToMultiCheckout();
            })

            it('Should Enter a New Address', () => {
                checkout.getOptionList().then($options => {
                    const initialOptionCount = $options.length;

                    checkout.expandSentToAddress();
                    checkout.verifyOptions(CHECKOUT_SELECTORS.sendToListOption, initialOptionCount);
            
                    checkout.goToNextSection('Add New Address');
                    forms.fillShippingData(shippingAddressParams, countryParams);

                    checkout.saveNewAddress();
                    results.shouldVerifyPageMessage(SAVE_NEW_ADDRESS_MESSAGE);

                    checkout.verifyOptions(CHECKOUT_SELECTORS.sendToListOption, initialOptionCount + 1);
                });
            });

            it('Should Update Qty & Addresses', () => {
                checkout.getProducts().then($products => {
                    const initialOptionCount = $products.length;

                    checkout.selectAddress(1);

                    widgets.shouldVerifyNumberOfElements(CHECKOUT_SELECTORS.productItemsInTable, initialOptionCount);
                    checkout.updateQty(2);
                    checkout.shouldClickOnButton(CART_SELECTORS.updateActionButton, 'Update Qty & Addresses');
                    widgets.shouldVerifyNumberOfElements(CHECKOUT_SELECTORS.productItemsInTable, initialOptionCount + 1);
                });
            });

            it('Should Remove Item', () => {
                checkout.getProducts().then($products => {
                    const initialOptionCount = $products.length;

                    widgets.shouldVerifyNumberOfElements(CHECKOUT_SELECTORS.productItemsInTable, initialOptionCount);
                    checkout.removeItem(1);
                    widgets.shouldVerifyNumberOfElements(CHECKOUT_SELECTORS.productItemsInTable, initialOptionCount - 1);
                });
            });

            it('Go back to Shopping Cart', () => {
                checkout.shouldNavigateBackToSection(
                    CHECKOUT_SELECTORS.backActionButton, 
                    'Back to Shopping Cart', 
                    'CartPage', 
                    '/checkout/cart/');
            });
        });

        describe('Select Shipping Page Action Verification', () => {

            beforeEach(() => {
                redirectToMultiCheckout();
                checkout.goToNextSection('Addresses');
            })

            it('Should change Shipping Address', () => {
                checkout.changeAddress();

                cy.url().should('contain', '/multishipping/checkout_address/editShipping/');
                results.shouldVerifyTextInSection(CHECKOUT_SELECTORS.defaultAddressInfo, 'It\'s a default shipping address.');
            });

            it('Should Edit Items', () => {
                checkout.editItems();

                cy.url().should('contain', '/multishipping/checkout/addresses/');
            });

            it('Go back to Select Addresses', () => {
                checkout.shouldNavigateBackToSection(
                    CHECKOUT_SELECTORS.backActionButton,
                    'Back to Select Addresses',
                    'MultiShippingPage',
                    '/multishipping/checkout/addresses/'
                );
            });
        });

        describe('Select Billing Information Page Action Verification', () => {

            beforeEach(() => {
                redirectToMultiCheckout();
                checkout.goToNextSection('Addresses');
                checkout.goToNextSection('Shipping');
            });

            it('Should change Billing Address', () => {
                checkout.changeBilling();

                cy.url().should('contain', '/multishipping/checkout_address/selectBilling/');
            });

            it('Go back to Shipping Information', () => {
                checkout.shouldNavigateBackToSection(
                    CHECKOUT_SELECTORS.backActionButton,
                    'Back to Shipping Information',
                    'MultiShippingMethodPage',
                    '/multishipping/checkout/shipping/'
                );
            });
        });

        describe('Review Your Order Page Action Verification', () => {

            beforeEach(() => {
                redirectToMultiCheckout();
                routes.visitAndWait('MultiShippingOverviewPage');
            });

            it('Should change Billing Address', () => {
                checkout.changeBilling();
                results.shouldVerifyTextInSection(CHECKOUT_SELECTORS.defaultAddressInfo, 'It\'s a default billing address.');
                
                cy.url().should('contain', '/multishipping/checkout_address/editBilling/');
            });

            it('Should change Shipping Address', () => {
                checkout.changeAddress();
                results.shouldVerifyTextInSection(CHECKOUT_SELECTORS.defaultAddressInfo, 'It\'s a default shipping address.');
                
                cy.url().should('contain', '/multishipping/checkout_address/editShipping/');
            });

            it('Should Edit Items', () => {
                checkout.editItems();

                cy.url().should('contain', '/multishipping/checkout/addresses/');
            });

            it('Go back to Billing Information', () => {
                checkout.shouldNavigateBackToSection(
                    CHECKOUT_SELECTORS.backActionButton,
                    'Back to Billing Information',
                    'MultiShippingBillingPage',
                    '/multishipping/checkout/shipping/'
                );
            });
        });
    });
});