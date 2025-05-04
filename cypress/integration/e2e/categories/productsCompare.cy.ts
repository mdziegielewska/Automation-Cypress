/// <reference types="cypress"/>

import { results } from "../../helpers/results";
import { product } from "../../helpers/product";
import { routes } from "../../helpers/routes";


let compareTable = ['SKU', 'Description'];

/**
 * Helper function to add a product to the comparison list and verify the message.
 */
const addProductToCompareAndVerifyMessage = () => {
    product.getProductName().then(name => {
        const productName = name.trim();

        const ADD_TO_COMPARISION_MESSAGE = `You added product ${productName} to the comparison list.`;

        routes.expect('AddToCompareResult');
        product.addToWishlistOrCompare('Compare');
        cy.wait('@AddToCompareResult');

        results.shouldVerifyPageMessage(ADD_TO_COMPARISION_MESSAGE);
    });
};


describe('Categories - Product Comparision', () => {

    beforeEach(() => {
        cy.clearAllCookies();
        routes.visitAndWait('ListingPantsPage');
    })

    it('Should add to Compare', () => {
        addProductToCompareAndVerifyMessage();
        product.compareProducts();
        results.shouldVerifyPageTitle('Compare Products');
    })

    it('Should open Compare Page', () => {
        addProductToCompareAndVerifyMessage();

        cy.visit('/women/bottoms-women/shorts-women.html');

        addProductToCompareAndVerifyMessage();
        product.compareProducts();
        results.shouldVerifyPageTitle('Compare Products');

        for (const element of compareTable) {
            product.getCompareTable()
                .should('contain', element);
        }
    })
})