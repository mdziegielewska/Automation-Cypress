/// <reference types="cypress"/>

import { results } from "../../helpers/results";
import { listing } from "../../helpers/listings";
import { product } from "../../helpers/product";
import { forms } from "../../helpers/forms";
import { navigation } from "../../helpers/navigation";

let productName: string;
let ADD_TO_COMPARISION_MESSAGE: string;

let compareTable = [ 'SKU', 'Description' ];


describe('Product comparision', () => {

    beforeEach(() => {
        
        cy.clearAllCookies();
        cy.visit('/women/bottoms-women/pants-women.html');
    })

    it('Should add to Compare', () => {

        product.getProductName().then(name => {

            productName = name.trim();

            ADD_TO_COMPARISION_MESSAGE = `You added product ${productName} to the comparison list.`;

            product.addToWishlistOrCompare("compare");
            results.shouldVerifyPageMessage(ADD_TO_COMPARISION_MESSAGE);

            product.compareProducts();
        });
    })
    
    it('Should open compare page', () => {

        product.addToWishlistOrCompare("compare");

        cy.visit('/women/bottoms-women/shorts-women.html');

        product.addToWishlistOrCompare("compare");
        product.compareProducts();

        results.shouldVerifyPageTitle('Compare Products');

        for(const element of compareTable) {
            
            product.getCompareTable()
                .should('contain', element);
        }
    })
})