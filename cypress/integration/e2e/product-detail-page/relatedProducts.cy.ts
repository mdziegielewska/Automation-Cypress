/// <reference types="cypress"/>

import { product } from "../../helpers/product";
import { results } from "../../helpers/results";
import { widgets } from "../../helpers/widgets";
import { PRODUCT_SELECTORS } from "../../selectors/selectors";


const ADD_TO_WISHLIST_MESSAGE = "You must login or register to add items to your wishlist.";
const ADD_TO_COMPARISION_MESSAGE = "You added product Carina Basic Capri to the comparison list.";

const isEquipment = false;


describe('PDP - Related Products', () => {

    beforeEach(() => {

        cy.visit('/juno-jacket.html');
        cy.clearAllCookies();
    })

    it('Should show Related Products', () => {

        results.shouldVerifyTextInSection(PRODUCT_SELECTORS.relatedProductsBlock, 'Related Products');

        product.getRelated().as('products');
        widgets.shouldVerifyNumberOfElements('@products', 4);
    })

    it('Product Item should contain elements', () => {

        product.shouldVerifyProductCellElements(isEquipment);
        product.shouldVerifyActionElements();
    })

    it('Should add to Wishlist', () => {

        product.addToWishlistOrCompare("wishlist");
        results.shouldVerifyPageMessage(ADD_TO_WISHLIST_MESSAGE);

        cy.url()
            .should('contain', '/customer/account/login/');
    })

    it('Should add to Comparision', () => {

        product.addToWishlistOrCompare("compare");
        results.shouldVerifyPageMessage(ADD_TO_COMPARISION_MESSAGE);
    })
})