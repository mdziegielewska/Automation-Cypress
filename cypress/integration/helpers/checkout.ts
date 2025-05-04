/// <reference types="cypress"/>

import { CHECKOUT_SELECTORS } from "../selectors/selectors";


let checkoutElements: { name: string; selector: string; }[];

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


class Checkout {

    /**
     * Verifies the visibility and non-emptiness of checkout elements based on the provided type.
     * @param {('Shipping' | 'Payments' | 'Order Item')} type - The type of checkout elements to verify.
     */
    verifyCheckoutElements(type: 'Shipping' | 'Payments' | 'Order Item'): void {
        cy.log(`Verifying ${type} Elements`);

        switch (type) {
            case 'Shipping':
                checkoutElements = checkoutShippingElements;
                break;

            case 'Order Item':
                checkoutElements = orderItemElements;
                break;

            case 'Payments':
                checkoutElements = checkoutRPElements;
        }

        this.expandItemsSection();

        checkoutElements.forEach(({ name, selector }) => {
            cy.log(`Verifying if ${name} is visible`);

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
}

export const checkout = new Checkout();