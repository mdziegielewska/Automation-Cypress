/// <reference types="cypress"/>

import { authorization } from "../../helpers/authorization";
import { cart } from '../../helpers/cart';
import { checkout } from "../../helpers/checkout";
import { product } from "../../helpers/product";
import { results } from "../../helpers/results";
import { routes } from "../../helpers/routes";


let isLogged: boolean = false;

const checkoutType = 'Checkout';
const couponList = [
    { couponCode: 'test123', type: 'Invalid' },
    { couponCode: 'h20', type: 'Valid' },
]

/**
 * Helper function to add a default product to the cart if it's empty and navigate to the checkout page.
 */
const addDefaultProductIfNeeded = () => {
    cart.isEmpty().then((isEmpty) => {
        if (isEmpty) {
            product.addDefaultProductToCart();
            product.addDefaultEquipmentProductToCart();
        }
    })
};

describe(`Transaction Path - ${checkoutType}`, () => {

    beforeEach(() => {
        if (!isLogged) {
            cy.session('login', () => {
                authorization.logInAndSetCookie();
                isLogged = true;
            }, {
                validate() {
                    cy.getCookie('PHPSESSID')
                        .should('exist');
                }
            });
        }

        addDefaultProductIfNeeded();
    })

    describe(`${checkoutType} Element Verification`, () => {
        it('Should show all Elements - Shipping', () => {
            routes.visitAndWait('CheckoutPage');

            checkout.shouldShowProgress('Shipping');
            checkout.verifyCheckoutElements('Shipping');
            checkout.verifyCheckoutElements('Order Item');
        })

        it('Should show all Elements - Review & Payments', () => {
            routes.visitAndWait('CheckoutPage', '/checkout/#payment');

            checkout.shouldShowProgress('Review & Payments');
            checkout.verifyCheckoutElements('Payments');
            checkout.verifyCheckoutElements('Order Item');
        })
    })

    describe('Placing Order Verification', () => {
        it('Should place an Order as Logged In User', () => {
            /*
            Shipping address should exist and be checked
            Shipping method should be checked
            Click on Next Button
    
            My billing and shipping address are the same should be checked
            Place Order
            Thank You Page - Continue Shopping
            */
        })

        it('Should place an Order as a New User', () => {
            /*
            Fill Email, First Name, Last Name, Street Address, City, State/Province, Zip/Postal Code, Country, Phone Number
            Check first Shipping Method 
            Click on Next Button
    
            My billing and shipping address are the same should be checked
            Place Order
            Thank You Page - Continue Shopping & Create an Account
            */
        })
    })

    describe('Coupon Section Verification', () => {
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

    describe(`${checkoutType} Action Verification`, () => {
        it('Should add New Shipping Address at Checkout', () => {
            // to do
        })

        it('Should choose different Billing Address', () => {
            // to do
        })

        it('Should edit Ship To & Shipping Method', () => {
            // to do
        })
    })
})