/// <reference types="cypress"/>

import { CART_SELECTORS, CHECKOUT_SELECTORS } from "../selectors/selectors";
import { results } from "./results";
import { routes } from "./routes";


const THANK_YOU_PAGE_TITLE = 'Thank you for your purchase!';
const THANK_YOU_PAGE_MESSAGE = 'We\'ll email you an order confirmation with details and tracking info';

const checkoutShippingElements = [
    { name: 'Progress Bar', selector: CHECKOUT_SELECTORS.progressBar },
    { name: 'Shipping Address', selector: CHECKOUT_SELECTORS.shippingAddressSection },
    { name: 'Shipping Methods', selector: CHECKOUT_SELECTORS.shippingMethodSection },
    { name: 'Order Summary', selector: CHECKOUT_SELECTORS.summarySection }
]

const checkoutRPElements = [
    { name: 'Progress Bar', selector: CHECKOUT_SELECTORS.progressBar },
    { name: 'Payment Method', selector: CHECKOUT_SELECTORS.paymentMethodSection },
    { name: 'Discount Section', selector: CHECKOUT_SELECTORS.discountSection },
    { name: 'Order Summary', selector: CHECKOUT_SELECTORS.summarySection },
    { name: 'Shipping Information', selector: CHECKOUT_SELECTORS.shippingInfoSection }
]

const orderItemElements = [
    { name: 'title', selector: CHECKOUT_SELECTORS.productTitle },
    { name: 'qty', selector: CHECKOUT_SELECTORS.productQty },
    { name: 'price', selector: CHECKOUT_SELECTORS.productPrice },
    { name: 'options', selector: CHECKOUT_SELECTORS.productOptions },
    { name: 'photo', selector: CHECKOUT_SELECTORS.productPhoto }
];

const billingSelectors = [
    CHECKOUT_SELECTORS.billingInfoSection,
    CHECKOUT_SELECTORS.billingAddressDetails
];


class Checkout {

    /**
     * Verifies the visibility and non-emptiness of checkout elements based on the provided type.
     * @param {('Shipping' | 'Payments' | 'Order Item')} type - The type of checkout elements to verify.
     */
    verifyCheckoutElements(type: 'Shipping' | 'Payments' | 'Order Item'): void {
        cy.log(`Verifying ${type} Elements`);

        let checkoutElements: { name: string; selector: string; }[];

        switch (type) {
            case 'Shipping':
                checkoutElements = checkoutShippingElements;
                break;

            case 'Order Item':
                checkoutElements = orderItemElements;
                break;

            case 'Payments':
                checkoutElements = checkoutRPElements;
                break;

            default:
                throw new Error(`Unsupported checkout element type: ${type}`);
        }

        this.expandItemsSection();

        checkoutElements.forEach(({ name, selector }) => {
            cy.log(`Checking visibility of ${name}`);

            cy.get(selector)
                .should('be.visible')
                .and('not.be.empty');
        })
    }

    /**
     * Verifies if the specified checkout progress section is active.
     * @param {string} activeSection - The name of the active checkout progress section.
     */
    shouldShowProgress(activeSection: string): void {
        cy.log(`Verifying if ${activeSection} is active`);

        cy.get(CHECKOUT_SELECTORS.progressBar)
            .find(CHECKOUT_SELECTORS.progressBarItem)
            .should('contain', activeSection)
            .and('have.class', '_active');
    }

    /**
     * Expands the "Items in Cart" section within the order summary.
     */
    expandItemsSection(): void {
        cy.log('Expanding Items in Cart Section');

        cy.get(CHECKOUT_SELECTORS.summarySection).within(() => {
            cy.get(CHECKOUT_SELECTORS.itemsInCartSection)
                .click()
                .should('have.class', 'active');
        })
    }

    /** 
     * Clicks a button that matches the given selector and text.
     * @param {string} selector - The CSS selector of the button container.
     * @param {string} text - The visible text on the button.
    */
    shouldClickOnButton(selector: string, text: any): void {
        cy.log(`Clicking on a button with text: ${text}`);

        cy.get(selector)
            .contains(text)
            .should('exist')
            .click();
    }

    /**
     * Verifies that the shipping address and method sections are properly selected.
     */
    shouldVerifyShippingSection(): void {
        cy.log('Verifying selected Shipping Address and Method');

        cy.get(CHECKOUT_SELECTORS.shippingAddressItem)
            .should('exist')
            .and('have.class', 'selected-item');

        cy.get(CHECKOUT_SELECTORS.shippingMethodTable)
            .find(CHECKOUT_SELECTORS.shippingMethodButton)
            .should('have.attr', 'checked');
    }

    /**
     * Verifies that the billing section is visible and contains address details.
     */
    shouldVerifyBillingSection(): void {
        cy.log('Verifying selected Shipping Address');

        billingSelectors.forEach(selector => {
            cy.get(selector).should('be.visible');
        });
    }

    /**
     * Selects a shipping method option by index (0-based).
     * @param {number} index - Index of the shipping method to select.
     */
    shouldCheckShippingMethod(index: number): void {
        cy.log(`Checking Shipping Method with index ${index}`);

        cy.get(CHECKOUT_SELECTORS.shippingMethodTable)
            .find(CHECKOUT_SELECTORS.shippingMethodButton)
            .eq(index)
            .click();
    }

    /**
     * Validates that the Thank You page is displayed with the correct title and confirmation message.
     */
    shouldVerifyThankYouPage(): void {
        cy.log('Verifying correctness of Thank You Page');

        cy.expect('SuccessPage');
        results.shouldVerifyPageTitle(THANK_YOU_PAGE_TITLE);
        results.shouldVerifyTextInSection(CHECKOUT_SELECTORS.successPage, THANK_YOU_PAGE_MESSAGE);
    }

    /**
     * Verifies that a select dropdown identified by the given selector contains the expected number of options.
     *
     * @param selector - The CSS selector for the dropdown element.
     * @param numberOfOptions - The expected number of option elements within the dropdown.
     */
    verifyOptions(selector: string, numberOfOptions: number): void {
        cy.log(`Verifying that the dropdown at ${selector} contains ${numberOfOptions} options`);

        cy.get(selector)
            .should('have.class', 'select')
            .find(CHECKOUT_SELECTORS.option)
            .should('have.length', numberOfOptions);
    }

    /**
     * Clicks on the edit button within the shipping information section based on the provided index.
     * @param index - The index of the edit button to click (0 for "Ship To", 1 for "Shipping Method")
     */
    clickOnEditButtons(index: number): void {
        cy.get(CHECKOUT_SELECTORS.shippingInfoSection).within(() => {
            cy.get(CHECKOUT_SELECTORS.shippingInfoTitle)
                .find(CART_SELECTORS.editButtonCart)
                .eq(index)
                .click();
        });
    }

    /**
     * Clicks the "Place Order" button and waits for the success page to load.
     */
    placeOrder(): void {
        cy.log('Placing Order');

        routes.expect('SuccessPage');
        checkout.shouldClickOnButton(CHECKOUT_SELECTORS.placeOrderButton, 'Place Order');
        cy.wait('@SuccessPage');
    }
}

export const checkout = new Checkout();