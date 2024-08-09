/// <reference types="cypress"/>

import { product } from "../../helpers/product";
import { results } from "../../helpers/results";
import { widgets } from "../../helpers/widgets";

const hotSellers = '.content-heading';

describe('Main page - Hot Sellers', () => {

    beforeEach(() => {
        cy.visit('/');
    })

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
})