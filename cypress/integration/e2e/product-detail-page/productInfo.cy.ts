/// <reference types="cypress"/>

import { gallery } from "../../helpers/gallery";
import { product } from "../../helpers/product";
import { results } from "../../helpers/results";
import { routes } from "../../helpers/routes";
import { widgets } from "../../helpers/widgets";
import { PRODUCT_SELECTORS } from "../../selectors/productSelectors";


const tabs = [
    { name: 'Details', locator: PRODUCT_SELECTORS.descriptionTab },
    { name: 'More Information', locator: PRODUCT_SELECTORS.additionalTab },
    { name: 'Reviews', locator: PRODUCT_SELECTORS.reviewsTab }
];

const ADD_TO_WISHLIST_MESSAGE = "You must login or register to add items to your wishlist.";
const ADD_TO_COMPARISION_MESSAGE = "You added product Aeon Capri to the comparison list.";
const ADD_TO_CART_MESSAGE = "You added Juno Jacket to your shopping cart.";


describe('PDP - Product Info', () => {

    describe('PDP - Visual Verification', { testIsolation: false }, () => {

        before(() => {
            routes.visitAndWait('JunoJacketPDP');
        });

        it('Should show PDP elements', () => {
            product.shouldVerifyMainPDPElements();
            product.shouldDisplayProductInfo();
        });

        it('Gallery should contain images', () => {
            gallery.getGallery();

            widgets.shouldVerifyNumberOfElements(PRODUCT_SELECTORS.thumbnail, 3);
            gallery.verifyArrowScrolling();
        });

        it('Should verify details and more information sections', () => {
            product.shouldVerifyTabSwitching(tabs);

            product.shouldDisplayDetailsSectionText();
            product.shouldVerifyMoreInformationSections();
        });
    });

    describe('PDP - Action Verification', () => {

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

        it('Should add to Cart', () => {
            product.addToCart('PDP');

            results.shouldVerifyPageMessage(ADD_TO_CART_MESSAGE);
        });
    });
});