/// <reference types="cypress"/>

const listingElements = [
    { name: 'Title', locator: '.page-title'  },
    { name: 'Toolbar', locator: '.toolbar-products' },
    { name: 'Results', locator: '.product-items' },
    { name: 'Filters', locator: '#layered-filter-block' },
    { name: 'Compare section', locator: '#block-compare-heading' },
    { name: 'Wishlist section', locator: '.block-wishlist' }
];

const additionalSidebar = ['Compare Products', 'My Wish List'];

class Listing {
    shouldContainFilterBlock() {
        cy.log('verifying filter block');

        cy.get('.sidebar-main')
            .should('be.visible');
    }

    shouldContainAdditionalSidebar() {
        cy.log('verifying additional sidebar');

        for(const sidebar of additionalSidebar) {
            cy.get('.sidebar-additional')
                .find('.block')
                .contains(sidebar)
                .should('be.visible');
        }
    }
    
    shouldVerifyListingElements() {
        for(const element of listingElements) {
            cy.log(`verifying listing elements - ${element.name}`);

            cy.get(element.locator)
                .should('be.visible');
        }
    }
} 

export const listing = new Listing();