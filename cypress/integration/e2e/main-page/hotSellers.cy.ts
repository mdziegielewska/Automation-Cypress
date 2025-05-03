/// <reference types="cypress"/>

import { product } from "../../helpers/product";
import { results } from "../../helpers/results";
import { routes } from "../../helpers/routes";
import { widgets } from "../../helpers/widgets";
import { LISTING_SELECTORS } from "../../selectors/selectors";


const ADD_TO_CART_MESSAGE = "You added Radiant Tee to your shopping cart.";
const ADD_TO_WISHLIST_MESSAGE = "You must login or register to add items to your wishlist.";
const ADD_TO_COMPARISION_MESSAGE = "You added product Radiant Tee to the comparison list.";

const isEquipment = false;


describe('Main page - Hot Sellers', () => {

    beforeEach(() => {
        cy.clearAllCookies();
        routes.visitAndWait('LoadPage');
    })

    it('Should show Hot Sellers', () => {
        results.shouldVerifyTextInSection(LISTING_SELECTORS.gridBlocksHeading, 'Hot Sellers');

        widgets.getGridWidgetItems().as('products');
        widgets.shouldVerifyNumberOfElements('@products', 6);
    })

    it('Product Item should contain elements', () => {
        product.shouldVerifyProductCellElements(isEquipment);
        product.shouldVerifyActionElements();
    })

    it('Should add to Cart', () => {
        product.selectSize('M');
        product.selectColor('Purple');

        product.addToCart('Listing Page', true);
        results.shouldVerifyPageMessage(ADD_TO_CART_MESSAGE);
    })

    it('Should add to Wishlist', () => {
        routes.expect('AddToWishlistResult');
        product.addToWishlistOrCompare("wishlist");
        cy.wait('@AddToWishlistResult');

        results.shouldVerifyPageMessage(ADD_TO_WISHLIST_MESSAGE);

        cy.url()
            .should('contain', '/customer/account/login/');
    })

    it('Should add to Comparision', () => {
        routes.expect('AddToCompareResult');
        product.addToWishlistOrCompare("compare");
        cy.wait('@AddToCompareResult');

        results.shouldVerifyPageMessage(ADD_TO_COMPARISION_MESSAGE);
    })
})