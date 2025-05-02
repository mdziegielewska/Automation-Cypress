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

const couponList = [
    { couponCode: 'test123', type: 'invalid' },
    { couponCode: 'h20', type: 'valid' },
]


describe('Transaction Path - Cart', () => {
    it('Should display all Cart item elements', () => {
            addDefaultProductAndGoToCart();

            results.shouldVerifyPageTitle('Shopping Cart');
            cart.verifyProductDetailsInCart();
        });

    describe('Cart Actions Verification', () => {
        
        beforeEach(() => {
            addDefaultProductAndGoToCart();
        })

        it('Should redirect to Product Page after clicking thumbnail', () => {
            cart.redirectToPDP('/circe-hooded-ice-fleece.html');
            routes.expect('HoodiePDP');
        });

        it('Should edit Product from cart', () => {
            cart.editCartItem('cart');
            cart.updateCartPDP();
    
            results.shouldVerifyPageMessage(UPDATE_MESSAGE);
        });
    
        it('Should delete Product from cart', () => {
            cart.deleteCartItem('cart');
            cart.shouldBeEmpty();
        });
    
        it('Should increase Product Quantity', () => {
            cart.verifyItemsCount(1, 'cart');
            cart.changeCartItemQuantity(2, 'cart');
            cart.verifyItemsCount(2, 'cart');
        });

        it('Should test Estimate Shipping and Tax section', () => {
            cart.openTaxSection();
            cart.fillTaxSection('Poland', 'pomorskie', '12-345');
            cart.verifyingShippingRates();
        });

        it('Should proceed to Checkout', () => {
            cart.shouldClickCheckoutButton('cart');
    
            cy.url()
                .should('include', '/checkout/#shipping');
        });
    })

    describe('Coupon Section Verification', () => {
    
        beforeEach(() => {
            routes.visitAndExpect('/affirm-water-bottle.html', 'WaterBottlePDP');
    
            product.addToCartPDP(true);
    
            ADD_TO_CART_MESSAGE = 'You added Affirm Water Bottle  to your shopping cart.';
            results.shouldVerifyPageMessage(ADD_TO_CART_MESSAGE);
    
            routes.visitAndExpect('/checkout/cart/', 'CartPage');
        })

        couponList.forEach(({couponCode, type})  => {
            it(`Should apply ${type} Code`, () => {
                const COUPON_MESSAGE = (type === 'invalid')
                    ? `The coupon code "${couponCode}" is not valid.`
                    : `You used coupon code "${couponCode}".`; 

                cart.openCouponSection();
                cart.applyCoupon(couponCode);
                results.shouldVerifyPageMessage(COUPON_MESSAGE);
            })
        })
    })
});