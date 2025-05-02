/// <reference types="cypress"/>

import { CART_SELECTORS } from "../selectors/selectors";
import { forms } from "./forms";
import { routes } from "./routes";

const cartItemElements = [
    { name: 'title', selector: CART_SELECTORS.cartPageProductName },
    { name: 'options', selector: CART_SELECTORS.productCartOptions },
    { name: 'price', selector: CART_SELECTORS.productPrice },
    { name: 'qty', selector: CART_SELECTORS.productQtyInput },
    { name: 'subtotal', selector: CART_SELECTORS.productSubtotal },
    { name: 'edit', selector: CART_SELECTORS.editButtonCart },
    { name: 'delete', selector: CART_SELECTORS.deleteButtonCart },
    { name: 'photo', selector: CART_SELECTORS.productImage }
];

const summaryItemsElements = [
    'Estimate Shipping and Tax', 'Subtotal', 'Tax', 'Order Total', 'Proceed to Checkout', 'Check Out with Multiple Addresses'
];


class Cart {

    /**
     * Opens the mini cart.
     */
    openMiniCart(): void {
        cy.log('Opening mini cart');

        cy.get(CART_SELECTORS.miniCartToggle)
            .click()
            .should('have.class', 'active');
    }

    /**
     * Closes the mini cart.
     */
    closeMiniCart(): void {
        cy.log('Closing mini cart');

        cy.get(CART_SELECTORS.closeMiniCartButton)
            .click();

        cy.get(CART_SELECTORS.miniCartToggle)
            .should('not.have.class', 'active');
    }

    /**
     * Verifies if the cart (mini cart) is empty.
     */
    shouldBeEmpty(): void {
        cy.log('Verifying if cart is empty');

        cy.get(CART_SELECTORS.miniCartWrapper)
            .should('contain.text', 'You have no items in your shopping cart.');
    }

    /**
    * Verifies the number of items in the cart or mini cart.
    * @param count The expected number of items.
    * @param type The type of cart ('minicart' or 'cart').
    */
    verifyItemsCount(count: number, type: 'minicart' | 'cart'): void {
        cy.log(`Verifying items count - ${type}`);

        switch (type) {
            case 'minicart':
                cy.get(CART_SELECTORS.miniCartWrapper).within(() => {
                    cy.get(CART_SELECTORS.itemsTotal)
                        .should('contain', count.toString());

                    cy.get(CART_SELECTORS.priceWrapper)
                        .should('contain', '$');
                });
                break;

            case 'cart':
                cy.get(CART_SELECTORS.itemsTotal)
                    .should('contain', count.toString());

                cy.get(CART_SELECTORS.priceWrapper)
                    .should('contain', '$');
                break;

            default:
                throw Error(`Unknown cart type: ${type}`);
        }
    }

    /**
     * Verifies product details within the mini cart.
     * @param productName The name of the product to verify.
     */
    verifyProductDetailsInMiniCart(productName: string): void {
        cy.log(`Verifying product details - ${productName}`);

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

    /**
     * Verifies the presence of all expected elements for a product item in the main cart view.
     */
    verifyProductDetailsInCart(): void {
        cy.get(CART_SELECTORS.cartItem).within(() => {
            cartItemElements.forEach(({ name, selector }) => {
                cy.log(`Verifying product detail in cart - ${name}`);

                cy.get(selector)
                    .should('be.visible');
            })
        });

        cy.get(CART_SELECTORS.cartSummary).within(() => {
            for (const element of summaryItemsElements) {
                cy.contains(element)
                    .should('be.visible');
            }
        })
    }

    /**
     * Clicks on the product image in the cart to navigate to the Product Detail Page (PDP).
     * @param url The expected substring that should be present in the URL after redirection.
     */
    redirectToPDP(url: string): void {
        cy.log('Redirecting to the product PDP');

        cy.get(CART_SELECTORS.productImage)
            .first()
            .click();

        cy.url()
            .should('contain', url);
    }

    /**
     * Clicks the edit button for a cart item in either the mini cart or main cart.
     * @param type The type of cart ('minicart' or 'cart').
     */
    editCartItem(type: 'minicart' | 'cart'): void {
        cy.log(`Editing cart item - ${type}`);

        switch (type) {
            case 'minicart':
                this.openMiniCart();
                cy.get(CART_SELECTORS.miniCartWrapper).within(() => {
                    cy.get(CART_SELECTORS.editButton)
                        .should('be.visible')
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

        routes.expect('EditPage');

        cy.url()
            .should('include', '/checkout/cart/configure/');
    }

    /**
     * Updates the quantity and potentially other options of a cart item.
     */
    updateCartPDP(): void {
        cy.log('Updating cart item from PDP');

        cy.get(CART_SELECTORS.updateCartForm).within(() => {

            cy.get(CART_SELECTORS.sizeSwatch)
                .find(CART_SELECTORS.swatchOption)
                .contains('L')
                .click();

            cy.get(CART_SELECTORS.updateCartButton)
                .should('be.visible')
                .click();
        });

        routes.expect('UpdateResult');
    }

    /**
     * Deletes a cart item from either the mini cart or main cart.
     * @param type The type of cart ('minicart' or 'cart').
     */
    deleteCartItem(type: 'minicart' | 'cart'): void {
        cy.log(`Deleting cart item - ${type}`);

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

        routes.expect('DeleteResult');
    }

    /**
     * Changes the quantity of a cart item in either the mini cart or main cart.
     * @param quantity The new quantity for the item.
     * @param type The type of cart ('minicart' or 'cart').
     */
    changeCartItemQuantity(quantity: number, type: 'minicart' | 'cart'): void {
        cy.log(`Changing cart item quantity to ${quantity} - ${type}`);

        switch (type) {
            case 'minicart':
                cy.get(CART_SELECTORS.miniCartWrapper).within(() => {
                    cy.get(CART_SELECTORS.qtyInput)
                        .clear()
                        .type(quantity.toString())
                        .blur();

                    cy.get(CART_SELECTORS.updateMiniCartButton)
                        .click();
                });
                break;

            case 'cart':
                cy.get(CART_SELECTORS.qtyInputCart)
                    .clear()
                    .type(quantity.toString())
                    .blur();

                cy.get(CART_SELECTORS.updateShoppingCartButton)
                    .click();
                break;

            default:
                throw Error(`Unknown cart type: ${type}`);
        }

        routes.expect('ChangeQty');
    }

    /**
     * Verifies the "Proceed to Checkout" button is visible and clicks it.
     */
    shouldClickCheckoutButton(type: 'minicart' | 'cart'): void {
        cy.log(`Verifying Proceed to Checkout button - ${type}`);

        switch (type) {
            case 'minicart':
                cy.get(CART_SELECTORS.miniCartWrapper).within(() => {
                    cy.get(CART_SELECTORS.checkoutButton)
                        .should('contain', 'Proceed to Checkout')
                        .click();
                });
                break;

            case 'cart':
                cy.get(CART_SELECTORS.proceedToCheckoutButton)
                    .should('contain', 'Proceed to Checkout')
                    .click();
                break;

            default:
                throw Error(`Unknown cart type: ${type}`);
        }

        routes.expect('CheckoutPage');
    }

    /**
     * Opens Apply Discount Code section.
     */
    openCouponSection() {
        cy.log('Opening Coupon section');

        cy.get(CART_SELECTORS.couponBlock)
            .should('have.attr', 'aria-expanded', 'false')
            .click()
            .should('have.attr', 'aria-expanded', 'true');
    }

    /**
     * Applies a coupon code to the cart.
     * @param couponCode The coupon code to apply.
     */
    applyCoupon(couponCode: string): void {
        cy.log(`Applying coupon code - ${couponCode}`);

        cy.get(CART_SELECTORS.couponCodeInput)
            .should('be.visible')
            .clear()
            .type(couponCode);

        cy.get(CART_SELECTORS.applyCouponButton)
            .click();

        routes.expect('CouponResult');
    }

    /**
     * Opens Estimate Shipping and Tax section.
     */
    openTaxSection() {
        cy.log('Opening Tax section');

        cy.get(CART_SELECTORS.shippingBlockTitle)
            .should('have.attr', 'aria-expanded', 'false')
            .click()
            .should('have.attr', 'aria-expanded', 'true');
    }

    /**
     * Fills out the country, state/province, and zip/postal code fields
     * in the Estimate Shipping and Tax section of the cart page.
     * Assumes the section is collapsible and needs to be expanded.
     * @param country The value to select for the country dropdown.
     * @param state The value to select for the state/province dropdown.
     * @param zipCode The zip/postal code to type into the input field.
     */
    fillTaxSection(country: string, state: string, zipCode: string): void {
        cy.log('Verifying shipping and tax estimation');

        let taxSelectorsElements = [
            { selector: CART_SELECTORS.countrySelect, selection: country },
            { selector: CART_SELECTORS.stateSelect, selection: state }
        ];

        taxSelectorsElements.forEach(({ selector, selection }) => {
            forms.selectValue(selector, selection);
        })

        cy.get(CART_SELECTORS.zipInput)
            .should('be.visible')
            .clear()
            .type(zipCode);
    }

    /**
     * Clicks the button to get shipping rates and verifies that shipping rate options are displayed.
     * Assumes the shipping details (country, state, zip) have already been filled.
     */
    verifyingShippingRates(): void {
        cy.log('Getting shipping rates');

        cy.get(CART_SELECTORS.getMethodButton)
            .should('be.visible')
            .click();

        cy.log('Verifying shipping rates are displayed');

        cy.get(CART_SELECTORS.shippingRateOptions)
            .should('be.visible')
            .find('td')
            .should('have.length.greaterThan', 0);
    }
}

export const cart = new Cart();