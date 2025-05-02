/// <reference types="cypress"/>

import { cart } from '../../helpers/cart';
import { product } from '../../helpers/product';
import { results } from '../../helpers/results';
import { routes } from '../../helpers/routes';


let ADD_TO_CART_MESSAGE: string;
let UPDATE_MESSAGE: string;

/**
 * Helper function to add a default product to the cart and navigate to the cart page.
 */
const addDefaultProductAndGoToCart = () => {
    routes.visitAndExpect('/women/tops-women/hoodies-and-sweatshirts-women.html', 'ListingPage');

    product.getProductName().then(name => {
        const productName = name.trim();

        ADD_TO_CART_MESSAGE = `You added ${productName} to your shopping cart.`;
        UPDATE_MESSAGE = `${productName} was updated in your shopping cart.`;

        product.addToCart();
        results.shouldVerifyPageMessage(ADD_TO_CART_MESSAGE);

        routes.visitAndExpect('/checkout/cart/', 'CartPage');
    });
};


describe('Transaction path - Cart', () => {

    it('Should display all Cart item elements', () => {
        addDefaultProductAndGoToCart();

        results.shouldVerifyPageTitle('Shopping Cart');
        cart.verifyProductDetailsInCart();
    });

    it('Should redirect to Product Page after clicking thumbnail', () => {
        addDefaultProductAndGoToCart();

        cart.redirectToPDP('/circe-hooded-ice-fleece.html');
        routes.expect('HoodiePDP');
    });

    it('Should edit Product from cart', () => {
        addDefaultProductAndGoToCart();

        cart.editCartItem('cart');
        cart.updateCartPDP();

        results.shouldVerifyPageMessage(UPDATE_MESSAGE);
    });

    it('Should delete Product from cart', () => {
        addDefaultProductAndGoToCart();

        cart.deleteCartItem('cart');
        cart.shouldBeEmpty();
    });

    it('Should increase Product Quantity', () => {
        addDefaultProductAndGoToCart();

        cart.verifyItemsCount(1, 'cart');
        cart.changeCartItemQuantity(2, 'cart');
        cart.verifyItemsCount(2, 'cart');
    });

    it('Should apply invalid code', () => {
        addDefaultProductAndGoToCart();
        
        const invalidCoupon = 'test123';
        const INVALID_COUPON_MESSAGE = `The coupon code "${invalidCoupon}" is not valid.`;

        cart.openCouponSection();
        cart.applyCoupon(invalidCoupon);
        results.shouldVerifyPageMessage(INVALID_COUPON_MESSAGE);
    });

    it('Should apply valid code', () => {
        routes.visitAndExpect('/affirm-water-bottle.html', 'WaterBottlePDP');

        product.addToCartPDP(true);

        ADD_TO_CART_MESSAGE = 'You added Affirm Water Bottle  to your shopping cart.';
        results.shouldVerifyPageMessage(ADD_TO_CART_MESSAGE);

        routes.visitAndExpect('/checkout/cart/', 'CartPage');

        const validCoupon = 'h20';
        const VALID_COUPON_MESSAGE = `You used coupon code "${validCoupon}".`;;

        cart.openCouponSection();
        cart.applyCoupon(validCoupon);
        results.shouldVerifyPageMessage(VALID_COUPON_MESSAGE);
    });

    it('Should test Estimate Shipping and Tax section', () => {
        addDefaultProductAndGoToCart();

        cart.openTaxSection();
        cart.fillTaxSection('Poland', 'pomorskie', '12-345');
        cart.verifyingShippingRates();
    });

    it('Should proceed to Checkout', () => {
        addDefaultProductAndGoToCart();

        cart.shouldClickCheckoutButton('cart');

        cy.url()
            .should('include', '/checkout/#shipping');
    });
});