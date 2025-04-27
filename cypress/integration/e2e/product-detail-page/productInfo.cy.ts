/// <reference types="cypress"/>

import { gallery } from "../../helpers/gallery";
import { product } from "../../helpers/product";
import { results } from "../../helpers/results";
import { widgets } from "../../helpers/widgets";

const tabs = [
    { name: 'Details', locator: '#description' },
    { name: 'More Information', locator: '#additional' },
    { name: 'Reviews', locator: '#reviews' }
]

const ADD_TO_WISHLIST_MESSAGE = "You must login or register to add items to your wishlist.";
const ADD_TO_COMPARISION_MESSAGE = "You added product Juno Jacket to the comparison list.";
const ADD_TO_CART_MESSAGE = "You added Juno Jacket to your shopping cart.";


describe('PDP - Product Info', () => {

    beforeEach(() => {

        cy.visit('/juno-jacket.html');
        cy.clearAllCookies();
    })

    const thumbnail = '.fotorama__thumb';

    it('Should show PDP elements', () => {
        
        product.shouldVerifyMainPDPElements();
        product.shouldDisplayProductInfo();
    })

    it('Gallery should contain images', ()=> {

        gallery.getGallery();

        widgets.shouldVerifyNumberOfElements(thumbnail, 3);
        gallery.verifyArrowScrolling();
    })

    it('Should verify details and more information sections', () => {

        product.shouldVerifyTabSwitching(tabs);

        product.shouldDisplayDetailsSectionText();
        product.shouldVerifyMoreInformationSections();
    });

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

    it('Should add to Cart', () => {
        
        product.addToCartPDP();
        results.shouldVerifyPageMessage(ADD_TO_CART_MESSAGE);
    })
})