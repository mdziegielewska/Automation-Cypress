/// <reference types="cypress"/>

import { cart } from '../../helpers/cart';
import { navigation } from '../../helpers/navigation';
import { product } from "../../helpers/product";
import { results } from "../../helpers/results";


let productName: string;
let ADD_TO_CART_MESSAGE: string;
let UPDATE_MESSAGE: string;


describe('Transaction path - Mini Cart', () => {

    beforeEach(() => {

        switch (Cypress.currentTest.title) {
            case 'Should show empty mini cart':
                cy.visit('/women/tops-women/hoodies-and-sweatshirts-women.html');

                break;

            default:
                cy.visit('/women/tops-women/hoodies-and-sweatshirts-women.html');

                product.getProductName().then(name => {

                    productName = name.trim();

                    ADD_TO_CART_MESSAGE = `You added ${productName} to your shopping cart.`;
                    UPDATE_MESSAGE = `${productName} was updated in your shopping cart.`;

                    product.addToCart();
                    results.shouldVerifyPageMessage(ADD_TO_CART_MESSAGE);
                })

                break;
        }
    })

    it.skip('Should show empty mini cart', () => {

        cart.openMiniCart();
        cart.shouldBeEmpty();
    })

    it('Should add to Cart and verify its content', () => {

        cart.openMiniCart();

        cart.verifyItemsCount(1, 'minicart');
        cart.verifyProductDetailsInMiniCart(productName);
        cart.shouldClickCheckoutButton('minicart');

        cy.url()
            .should('include', '/checkout/#shipping');
    })

    it('Should edit item in cart', () => {

        cart.editCartItem('minicart');
        cart.updateCartPDP();

        results.shouldVerifyPageMessage(UPDATE_MESSAGE);
    })

    it('Should delete item from cart', () => {

        cart.deleteCartItem('minicart');
        navigation.shouldConfirmModal();
        cart.shouldBeEmpty();
    })


    it('Should increase quantity of product in cart', () => {

        cart.openMiniCart();
        cart.verifyItemsCount(1, 'minicart');

        cart.changeCartItemQuantity(2, 'minicart');

        cart.verifyItemsCount(2, 'minicart');
    });
})