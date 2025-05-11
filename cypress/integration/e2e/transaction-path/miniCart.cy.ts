/// <reference types="cypress"/>

import { cart } from '../../helpers/cart';
import { navigation } from '../../helpers/navigation';
import { product } from '../../helpers/product';
import { results } from "../../helpers/results";
import { routes } from '../../helpers/routes';


const cartType = 'Mini Cart';


describe(`Transaction path - ${cartType}`, () => {
    let UPDATE_MESSAGE: string;
    let productName: string;

    beforeEach(() => {
        let testTitle = Cypress.currentTest.title;

        if (testTitle !== `Should show empty ${cartType}`) {
            cart.addAndRememberCart('Default');

            cy.window().then(win => {
                UPDATE_MESSAGE = win.sessionStorage.getItem('updateMessage');
                productName = win.sessionStorage.getItem('productName');
            });
        } else {
            cy.clearAllCookies();
        }
        routes.visitAndWait('LoadPage');
    });

    it(`Should show empty ${cartType}`, () => {
        cart.shouldBeEmpty();
    })

    it('Should add to Cart and verify its Content', () => {
        cart.openMiniCart();

        cart.verifyItemsCount(1, cartType);
        cart.verifyProductDetailsInMiniCart(productName);
        cart.shouldClickCheckoutButton(cartType);

        cy.url().should('include', '/checkout/#shipping');
    });

    describe.only(`${cartType} Actions Verification`, () => {

        beforeEach(() => {
            cy.clearAllCookies();
            product.addDefaultProductToCart();
        });

        it(`Should edit item in ${cartType}`, () => {
            cart.editCartItem(cartType);
            cart.updateCartPDP();

            results.shouldVerifyPageMessage(UPDATE_MESSAGE);
        });

        it(`Should increase quantity of product in ${cartType}`, () => {
            cart.openMiniCart();
            cart.verifyItemsCount(1, cartType);
            cart.changeCartItemQuantity(2, cartType);
            cart.verifyItemsCount(2, cartType);
        });

        it(`Should delete item from the ${cartType}`, () => {
            cart.deleteCartItem(cartType);
            navigation.shouldConfirmModal();
            cart.shouldBeEmpty();
        });
    });
});