/// <reference types="cypress"/>

import { product } from "../../helpers/product";
import { results } from "../../helpers/results";
import { routes } from "../../helpers/routes";
import { widgets } from "../../helpers/widgets";
import { PRODUCT_SELECTORS } from "../../selectors/productSelectors";


const ADD_TO_WISHLIST_MESSAGE = "You must login or register to add items to your wishlist.";
const ADD_TO_COMPARISION_MESSAGE = "You added product Aeon Capri to the comparison list.";


describe('PDP - Related Products', () => {
    const isEquipment = false;

    describe('Related Products - Visual Verification', { testIsolation: false }, () => {

        before(() => {
            routes.visitAndWait('JunoJacketPDP');
        });

        it('Product Item should contain elements', () => {
            product.shouldVerifyProductCellElements(isEquipment);
            product.shouldVerifyActionElements();
        });

        it('Should show Related Products', () => {
            results.shouldVerifyTextInSection(PRODUCT_SELECTORS.relatedProductsBlock, 'Related Products');

            product.getRelated().as('products');
            widgets.shouldVerifyNumberOfElements('@products', 4);
        });
    });

    describe('Related Products - Action Verification', () => {

        beforeEach(() => {
            cy.clearAllCookies();
            routes.visitAndWait('JunoJacketPDP');
        });

        it('Should add to Wishlist', () => {
            product.addToWishlistOrCompare('Wishlist');
            results.shouldVerifyPageMessage(ADD_TO_WISHLIST_MESSAGE);

            cy.url()
                .should('contain', '/customer/account/login/');
        });

        it('Should add to Comparision', () => {
            product.addToWishlistOrCompare('Compare');
            results.shouldVerifyPageMessage(ADD_TO_COMPARISION_MESSAGE);
        });
    });
});