/// <reference types="cypress"/>

import { CART_SELECTORS } from "../selectors/selectors";
import { routes } from "./routes";

const cartItemElements = [
    { name: 'title', selector: CART_SELECTORS.cartPageProductName },
    { name: 'options', selector: CART_SELECTORS.productCartOptions },
    { name: 'price', selector: CART_SELECTORS.productPrice },
    { name: 'qty', selector: CART_SELECTORS.productQtyInput },
    { name: 'subtotal', selector: CART_SELECTORS.productSubtotal },
    { name: 'edit', selector: CART_SELECTORS.editButtonCart },
    { name: 'delete', selector: CART_SELECTORS.deleteButtonCart },
]

const summaryItemsElements = [
    'Estimate Shipping and Tax', 'Subtotal', 'Tax', 'Order Total', 'Proceed to Checkout', 'Check Out with Multiple Addresses'
]


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

    verifyProductDetailsInMiniCart(productName: string) {
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

    verifyProductDetailsInCart() {
        cy.get(CART_SELECTORS.cartItem).within(() => {
            cartItemElements.forEach(({name, selector}) => {
                cy.log(`verifying product detail in cart - ${name}`);

                cy.get(selector)
                    .should('be.visible');
            } )
        });

        cy.get(CART_SELECTORS.cartSummary).within(() => {
            for(const element of summaryItemsElements) {
                cy.contains(element)
                    .should('be.visible');
            }
        })
    }

    editCartItem(type: 'minicart' | 'cart') {
        cy.log('editing cart item');

        switch (type) {
            case 'minicart':
                this.openMiniCart();
                cy.get(CART_SELECTORS.miniCartWrapper).within(() => {

                    cy.get(CART_SELECTORS.editButton)
                        .click();
                });

                break;

            case 'cart':
                cy.get(CART_SELECTORS.editButtonCart)
                    .click();

                break;

            default:
                throw Error(`Unknown cart type: ${type}`);
        }

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

    deleteCartItem(type: 'minicart' | 'cart') {
        cy.log('deleting cart item');

        switch (type) {
            case 'minicart':
                this.openMiniCart();
                cy.get(CART_SELECTORS.miniCartWrapper).within(() => {

                    cy.get(CART_SELECTORS.deleteButton)
                        .click();
                });

                break;

            case 'cart':
                cy.get(CART_SELECTORS.deleteButtonCart)
                    .click();

                break;

            default:
                throw Error(`Unknown cart type: ${type}`);
        }
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