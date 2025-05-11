/// <reference types="cypress"/>

import { cart } from '../../helpers/cart';
import { product } from '../../helpers/product';
import { results } from '../../helpers/results';
import { routes } from '../../helpers/routes';


const cartType = 'Cart';
const couponList = [
    { couponCode: 'test123', type: 'Invalid' },
    { couponCode: 'h20', type: 'Valid' },
];


describe(`Transaction Path - ${cartType}`, () => {
    
    it(`Should display all ${cartType} Item elements`, () => {
        cart.addAndRememberCart('Default');
        routes.visitAndWait('CartPage');

        results.shouldVerifyPageTitle('Shopping Cart');
        cart.verifyProductDetailsInCart();
    });

    describe(`${cartType} Actions Verification`, () => {
        let UPDATE_MESSAGE: string;

        beforeEach(() => {
            let testTitle = Cypress.currentTest.title;

            if (testTitle === `Should edit Product from ${cartType}`) {
                cy.clearAllCookies();
                product.addDefaultProductToCart();
            } else {
                cart.addAndRememberCart('Default');

                cy.window().then(win => {
                    UPDATE_MESSAGE = win.sessionStorage.getItem('updateMessage');
                });
            }
            routes.visitAndWait('CartPage');
        });

        it('Should redirect to Product Page after clicking Thumbnail', () => {
            cart.redirectToPDP('/eos-v-neck-hoodie.html');
            routes.expect('HoodiePDP');
        });

        it(`Should edit Product from ${cartType}`, () => {
            cart.editCartItem(cartType);
            cart.updateCartPDP();

            results.shouldVerifyPageMessage(UPDATE_MESSAGE);
        });

        it(`Should delete Product from ${cartType}`, () => {
            cy.clearAllCookies();
            product.addDefaultProductToCart();
            routes.visitAndWait('CartPage');

            cart.deleteCartItem(cartType);
            cart.shouldBeEmpty();
        });

        it('Should increase Product Quantity', () => {
            cart.verifyItemsCount(1, cartType);
            cart.changeCartItemQuantity(2, cartType);
            cart.verifyItemsCount(2, cartType);
        });

        it('Should test Estimate Shipping and Tax section', () => {
            cart.openTaxSection();
            cart.fillTaxSection('Poland', 'pomorskie', '12-345');
            cart.verifyingShippingRates();
        });

        it('Should proceed to Checkout', () => {
            cart.shouldClickCheckoutButton(cartType);

            cy.url().should('include', '/checkout/#shipping');
        });
    });

    describe('Coupon Section Verification', () => {

        beforeEach(() => {
            cart.addAndRememberCart('Equipment');
            routes.visitAndWait('CartPage');
        });

        couponList.forEach(({ couponCode, type }) => {
            it(`Should apply ${type} Code`, () => {
                const COUPON_MESSAGE = (type === 'Invalid')
                    ? `The coupon code "${couponCode}" is not valid.`
                    : `You used coupon code "${couponCode}".`;

                cart.openCouponSection();
                cart.applyCoupon(couponCode);
                results.shouldVerifyPageMessage(COUPON_MESSAGE);
            });
        });
    });
});