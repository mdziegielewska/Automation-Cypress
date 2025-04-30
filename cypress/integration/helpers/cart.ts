/// <reference types="cypress"/>

import { CART_SELECTORS } from "../selectors/selectors";
import { routes } from "./routes";


class Cart {

    openMiniCart() {
        cy.log('opening mini cart');

        cy.get(CART_SELECTORS.miniCartToggle)
            .click()
            .should('have.class', 'active');
    }

    closeMiniCart() {
        cy.log('closing mini cart');

        cy.get(CART_SELECTORS.closeMiniCartButton)
            .click();

        cy.get(CART_SELECTORS.miniCartToggle)
            .should('not.have.class', 'active');
    }

    shouldBeEmpty() {
        cy.log('verifying if cart is empty');

        cy.get(CART_SELECTORS.miniCartWrapper)
            .should('contain.text', 'You have no items in your shopping cart.');
    }

    verifyItemsCount(count: number) {
        cy.log('verifying items count');

        cy.get(CART_SELECTORS.miniCartWrapper).within(() => {

            cy.get(CART_SELECTORS.itemsTotal)
                .should('contain', count.toString());

            cy.get(CART_SELECTORS.priceWrapper)
                .should('contain', '$');
        });
    }

    verifyProductDetailsInCart(productName: string) {
        cy.log('verifying product details');

        cy.get(CART_SELECTORS.miniCartWrapper).within(() => {

            cy.get(CART_SELECTORS.productDetails).within(() => {

                cy.contains(productName)
                    .should('be.visible');

                cy.contains('See Details')
                    .should('be.visible')
                    .click();

                cy.get(CART_SELECTORS.productOptions)
                    .should('contain', 'Size')
                    .and('contain', 'Color');

                cy.get(CART_SELECTORS.qtyValue).should('not.be.empty');
                cy.get(CART_SELECTORS.editButton).should('be.visible');
                cy.get(CART_SELECTORS.deleteButton).should('be.visible');
            });

            cy.contains('View and Edit Cart')
                .should('be.visible')
                .and('have.attr', 'href')
                .and('include', 'checkout/cart');
        });
    }

    editCartItem() {
        cy.log('editing cart item');

        this.openMiniCart();
        cy.get(CART_SELECTORS.miniCartWrapper).within(() => {

            cy.get(CART_SELECTORS.editButton)
                .click();
        });

        cy.url()
            .should('include', '/checkout/cart/configure/');
    }

    updateCart() {
        cy.log('updating item in cart');

        cy.get(CART_SELECTORS.updateCartForm).within(() => {

            cy.get(CART_SELECTORS.sizeSwatch)
                .find(CART_SELECTORS.swatchOption)
                .contains('L')
                .click();

            cy.get(CART_SELECTORS.updateCartButton)
                .should('be.visible')
                .click();
        });
    }

    deleteCartItem() {
        cy.log('deleting cart item');

        this.openMiniCart();
        cy.get(CART_SELECTORS.miniCartWrapper).within(() => {

            cy.get(CART_SELECTORS.deleteButton).click();
        });
    }

    changeCartItemQuantity(quantity: number) {
        cy.log('changing cart item quantity');

        cy.get(CART_SELECTORS.miniCartWrapper).within(() => {

            cy.get(CART_SELECTORS.qtyInput)
                .clear()
                .type(quantity.toString())
                .blur();

            cy.get(CART_SELECTORS.updateMiniCartButton)
                .click();

            routes.expect('ChangeQty');
        });
    }

    shouldShowCheckoutButton() {
        cy.log('verifying Proceed to Checkout button');

        cy.get(CART_SELECTORS.miniCartWrapper).within(() => {

            cy.get(CART_SELECTORS.checkoutButton)
                .should('contain', 'Proceed to Checkout')
                .click();
        });

        cy.url()
            .should('include', '/checkout/#shipping');
    }
}

export const cart = new Cart();