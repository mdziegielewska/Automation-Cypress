/// <reference types="cypress"/>

import { cart } from '../../helpers/cart';
import { product } from '../../helpers/product';
import { results } from '../../helpers/results';
import { routes } from '../../helpers/routes';


let ADD_TO_CART_MESSAGE: string;
let UPDATE_MESSAGE: string;

const cartType = 'Cart';
const couponList = [
    { couponCode: 'test123', type: 'Invalid' },
    { couponCode: 'h20', type: 'Valid' },
]

/**
 * Helper function to add a default product to the cart and navigate to the cart page.
 */
const addDefaultProductAndGoToCart = () => {
    routes.visitAndWait('ListingPage');

    product.getProductName().then(name => {
        const productName = name.trim();

        ADD_TO_CART_MESSAGE = `You added ${productName} to your shopping cart.`;
        UPDATE_MESSAGE = `${productName} was updated in your shopping cart.`;

        product.addToCart('Listing Page');
        results.shouldVerifyPageMessage(ADD_TO_CART_MESSAGE);

        routes.visitAndWait('CartPage');
    });
};


describe('Transaction Path - Cart', () => {
    it('Should display all Cart Item elements', () => {
        addDefaultProductAndGoToCart();

        results.shouldVerifyPageTitle('Shopping Cart');
        cart.verifyProductDetailsInCart();
    });

    describe('Cart Actions Verification', () => {

        beforeEach(() => {
            addDefaultProductAndGoToCart();
        })

        it('Should redirect to Product Page after clicking Thumbnail', () => {
            cart.redirectToPDP('/eos-v-neck-hoodie.html');
            routes.expect('HoodiePDP');
        });

        it('Should edit Product from Cart', () => {
            cart.editCartItem(cartType);
            cart.updateCartPDP();

            results.shouldVerifyPageMessage(UPDATE_MESSAGE);
        });

        it('Should delete Product from cart', () => {
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
            routes.expect('CheckoutPage');
            cart.shouldClickCheckoutButton(cartType);
            cy.wait('@CheckoutPage');

            cy.url()
                .should('include', '/checkout/#shipping');
        });
    })

    describe('Coupon Section Verification', () => {

        beforeEach(() => {
            routes.visitAndWait('WaterBottlePDP');

            product.addToCart('PDP', true);

            ADD_TO_CART_MESSAGE = 'You added Affirm Water Bottle  to your shopping cart.';
            results.shouldVerifyPageMessage(ADD_TO_CART_MESSAGE);

            routes.visitAndWait('CartPage');
        })

        couponList.forEach(({ couponCode, type }) => {
            it(`Should apply ${type} Code`, () => {
                const COUPON_MESSAGE = (type === 'Invalid')
                    ? `The coupon code "${couponCode}" is not valid.`
                    : `You used coupon code "${couponCode}".`;

                cart.openCouponSection();
                cart.applyCoupon(couponCode);
                results.shouldVerifyPageMessage(COUPON_MESSAGE);
            })
        })
    })
});