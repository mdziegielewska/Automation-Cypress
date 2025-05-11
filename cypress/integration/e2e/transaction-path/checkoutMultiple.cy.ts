/// <reference types="cypress"/>

import { authorization } from "../../helpers/authorization";
import { checkout } from '../../helpers/checkout';
import { results } from "../../helpers/results";
import { routes } from "../../helpers/routes";
import { widgets } from "../../helpers/widgets";
import { CART_SELECTORS } from "../../selectors/cartSelectors";
import { CHECKOUT_SELECTORS } from "../../selectors/checkoutSelectors";


let isLogged: boolean = false;

const checkoutType = 'Checkout Multiple';

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


describe(`Transaction Path - ${checkoutType}`, () => {

    beforeEach(() => {
        let testTitle = Cypress.currentTest.title;

        if (testTitle === 'Should redirect to Log In Page when not Logged') {
            cy.clearAllCookies();
            isLogged = false;
        } else {
            isLogged = authorization.loginAsExistingUser();
        }
        checkout.addDefaultProductIfNeeded();
    });

    describe('Placing Order Verification', () => {
        it('Should place an Order as Logged In User and verify all Checkout Elements', () => {
            checkout.redirectToMultiCheckout();

            for (const step of checkoutSteps) {
                results.shouldVerifyPageTitle(step.pageTitle);
                checkout.verifyMultipleAddressesCheckoutElements(step.elementType as 'Addresses' | 'Shipping' | 'Payments' | 'Review');
                checkout.performStepAction(step);
            }
            checkout.placeOrder('Multicheckout');
        });

        it('Should redirect to Log In Page when not Logged', () => {
            routes.visitAndWait('CartPage');

            routes.expect('LogInRedirectPage');
            checkout.shouldClickOnButton(CHECKOUT_SELECTORS.multiShippingButton, 'Check Out with Multiple Addresses');
            cy.wait('@LogInRedirectPage');

            cy.url().should('contain', '/multishipping/checkout/login/');
        });
    });

    describe('Checkout Action Verification', () => {
        describe('Addresses Page Action Verification', () => {

            beforeEach(() => {
                checkout.redirectToMultiCheckout();
            });

            it('Should Enter a New Address', () => {
                checkout.getOptionList('Shipping').then($options => {
                    const initialOptionCount = $options.length;

                    checkout.expandSentToAddress();
                    checkout.verifyOptions(CHECKOUT_SELECTORS.selectShippingAddressDropdown, initialOptionCount);
            
                    checkout.goToNextSection('Add New Address');
                    checkout.fillFullShippingAddress();

                    checkout.verifyOptions(CHECKOUT_SELECTORS.selectShippingAddressDropdown, initialOptionCount + 1);
                });
            });

            it('Should Update Qty & Addresses', () => {
                checkout.getProducts().then($products => {
                    const initialOptionCount = $products.length;

                    checkout.selectAddress('Shipping', 1);
                    widgets.shouldVerifyNumberOfElements(CHECKOUT_SELECTORS.productItemsInTable, initialOptionCount);

                    checkout.updateQty(2);
                    checkout.shouldClickOnButton(CART_SELECTORS.updateActionButton, 'Update Qty & Addresses');
                    checkout.verifyCountChange(CHECKOUT_SELECTORS.productItemsInTable, initialOptionCount, 1);
                });
            });

            it('Should Remove Item', () => {
                checkout.getProducts().then($products => {
                    const initialCount = $products.length;
                    checkout.removeItem(1);
                    checkout.verifyCountChange(CHECKOUT_SELECTORS.productItemsInTable, initialCount, -1);
                });
            });

            it('Go back to Shopping Cart', () => {
                checkout.shouldNavigateBackToSection(
                    CHECKOUT_SELECTORS.backButton, 
                    'Back to Shopping Cart', 
                    'CartPage', 
                    '/checkout/cart/');
            });
        });

        describe('Select Shipping Page Action Verification', () => {

            beforeEach(() => {
                checkout.redirectToMultiCheckout();
                checkout.goToNextSection('Addresses');
            });

            it('Should change Shipping Address', () => {
                checkout.changeAddress();
                cy.url().should('contain', '/multishipping/checkout_address/editShipping/');
                
                results.shouldVerifyTextInSection(
                    CHECKOUT_SELECTORS.defaultAddressMessage, 
                    'It\'s a default shipping address.');
            });

            it('Should Edit Items', () => {
                checkout.editItems();

                cy.url().should('contain', '/multishipping/checkout/addresses/');
            });

            it('Go back to Select Addresses', () => {
                checkout.shouldNavigateBackToSection(
                    CHECKOUT_SELECTORS.backButton,
                    'Back to Select Addresses',
                    'MultiShippingPage',
                    '/multishipping/checkout/addresses/'
                );
            });
        });

        describe('Select Billing Information Page Action Verification', () => {

            beforeEach(() => {
                checkout.redirectToMultiCheckout();
                checkout.goToNextSection('Addresses');
                checkout.goToNextSection('Shipping');
            });

            it('Should change Billing Address', () => {
                checkout.changeBilling();
                cy.url().should('contain', '/multishipping/checkout_address/selectBilling/');
            });

            it('Go back to Shipping Information', () => {
                checkout.shouldNavigateBackToSection(
                    CHECKOUT_SELECTORS.backButton,
                    'Back to Shipping Information',
                    'MultiShippingMethodPage',
                    '/multishipping/checkout/shipping/'
                );
            });
        });

        describe('Review Your Order Page Action Verification', () => {

            beforeEach(() => {
                checkout.redirectToMultiCheckout();
                routes.visitAndWait('MultiShippingOverviewPage');
            });

            it('Should change Billing Address', () => {
                checkout.changeBilling();
                results.shouldVerifyTextInSection(
                    CHECKOUT_SELECTORS.defaultAddressMessage,
                    'It\'s a default billing address.');
                
                cy.url().should('contain', '/multishipping/checkout_address/editBilling/');
            });

            it('Should change Shipping Address', () => {
                checkout.changeAddress();
                results.shouldVerifyTextInSection(
                    CHECKOUT_SELECTORS.defaultAddressMessage,
                    'It\'s a default shipping address.');
                
                cy.url().should('contain', '/multishipping/checkout_address/editShipping/');
            });

            it('Should Edit Items', () => {
                checkout.editItems();
                cy.url().should('contain', '/multishipping/checkout/addresses/');
            });

            it('Go back to Billing Information', () => {
                checkout.shouldNavigateBackToSection(
                    CHECKOUT_SELECTORS.backButton,
                    'Back to Billing Information',
                    'MultiShippingBillingPage',
                    '/multishipping/checkout/shipping/'
                );
            });
        });
    });
});