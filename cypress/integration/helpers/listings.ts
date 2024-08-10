/// <reference types="cypress"/>

const listingElements = [
    { name: 'Title', locator: '.page-title'  },
    { name: 'Toolbar', locator: '.toolbar-products' },
    { name: 'Results', locator: '.product-items' },
    { name: 'Filters', locator: '#layered-filter-block' },
    { name: 'Compare section', locator: '#block-compare-heading' },
    { name: 'Wishlist section', locator: '.block-wishlist' }
];

class Listing {
    shouldVerifyListingElements() {
        for(const element of listingElements) {
            cy.log(`verifying listing elements - ${element.name}`);

            cy.get(element.locator)
                .should('be.visible');
        }
    }
} 

export const listing = new Listing();