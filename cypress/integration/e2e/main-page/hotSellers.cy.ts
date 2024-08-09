/// <reference types="cypress"/>

import { product } from "../../helpers/product";
import { results } from "../../helpers/results";
import { widgets } from "../../helpers/widgets";


const ADD_TO_CART_MESSAGE = "You added Radiant Tee to your shopping cart.";
const ADD_TO_WISHLIST_MESSAGE = "You must login or register to add items to your wishlist.";
const ADD_TO_COMPARISION_MESSAGE = "You added product Radiant Tee to the comparison list.";


describe('Main page - Hot Sellers', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.clearAllCookies();
    })

    const hotSellers = '.content-heading';

    it('Should show Hot Sellers', () => {
        
        results.shouldVerifyTextInSection(hotSellers, 'Hot Sellers');

        cy.get('.widget-product-grid')
            .should('be.visible')
            .find('li.product-item').as('products');

        widgets.shouldVerifyNumberOfElements('@products', 6);
    })

    it('Product Item should contain elements', () => {

        product.shouldVerifyProductCellElements();

        product.shouldVerifyHiddenElements();
    }) 

    it('Should add to Cart', () => {

        product.selectSize('M');
        product.selectColor('Purple');

        product.addToCart();
        results.shouldVerifyAlert(ADD_TO_CART_MESSAGE);
    })

    it('Should add to Wishlist', () => {

        product.addToWishlist();
        results.shouldVerifyAlert(ADD_TO_WISHLIST_MESSAGE);

        cy.url()
            .should('contain', '/customer/account/login/');
    })

    it('Should add to Comparision', () => {

        product.addToComparision();
        results.shouldVerifyAlert(ADD_TO_COMPARISION_MESSAGE);
    })
})