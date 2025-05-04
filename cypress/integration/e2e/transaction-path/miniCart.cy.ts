/// <reference types="cypress"/>

import { cart } from '../../helpers/cart';
import { navigation } from '../../helpers/navigation';
import { product } from "../../helpers/product";
import { results } from "../../helpers/results";


let productName: string;
let ADD_TO_CART_MESSAGE: string;
let UPDATE_MESSAGE: string;

const cartType = 'Mini Cart';

describe(`Transaction path - ${cartType}`, () => {

    beforeEach(() => {
        cy.visit('/women/tops-women/hoodies-and-sweatshirts-women.html');

        switch (Cypress.currentTest.title) {
            case `Should show empty ${cartType}`:
                break;

            default:
                product.getProductName().then(name => {
                    productName = name.trim();

                    ADD_TO_CART_MESSAGE = `You added ${productName} to your shopping cart.`;
                    UPDATE_MESSAGE = `${productName} was updated in your shopping cart.`;

                    product.addToCart('Listing Page');
                    results.shouldVerifyPageMessage(ADD_TO_CART_MESSAGE);
                })
                break;
        }
    })

    it(`Should show empty ${cartType}`, () => {
        cart.shouldBeEmpty();
    })

    it('Should add to Cart and verify its Content', () => {
        cart.openMiniCart();

        cart.verifyItemsCount(1, cartType);
        cart.verifyProductDetailsInMiniCart(productName);
        cart.shouldClickCheckoutButton(cartType);

        cy.url()
            .should('include', '/checkout/#shipping');
    })

    it(`Should edit item in ${cartType}`, () => {
        cart.editCartItem(cartType);
        cart.updateCartPDP();

        results.shouldVerifyPageMessage(UPDATE_MESSAGE);
    })

    it(`Should delete item from the ${cartType}`, () => {
        cart.deleteCartItem(cartType);
        navigation.shouldConfirmModal();
        cart.shouldBeEmpty();
    })


    it(`Should increase quantity of product in ${cartType}`, () => {
        cart.openMiniCart();
        cart.verifyItemsCount(1, cartType);

        cart.changeCartItemQuantity(2, cartType);

        cart.verifyItemsCount(2, cartType);
    });
})