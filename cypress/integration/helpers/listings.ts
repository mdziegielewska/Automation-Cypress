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

    shouldVerifyProductsNumber(number: number) {
        cy.log('verifying products number on listing');

        cy.get('.toolbar-amount')
            .find('.toolbar-number')
            .should('contain', `${number}`);
    }

    shouldChangeLimiter(number: number) {
        cy.log('verifying limiter change');

        cy.get('#limiter.limiter-options')
            .eq(1)
            .select(`${number}`)
            .wait(500);
    }

    shouldSortBy(sort: string) {
        cy.log(`sorting by ${sort}`);

        cy.get('#sorter.sorter-options')
            .eq(0)
            .select(sort)
            .wait(500);
    }

    shouldChangeModes(mode: string) {
        cy.log(`changing mode to ${mode}`);

        if(mode == 'list') {
            cy.get(`a.mode-${mode}`).eq(0)
            .click({force: true})
            .wait(500);
        }
    }

    shouldVerifyCurrentMode(mode: string) {
        cy.log('verifying chosen mode');

        cy.get(`.products.wrapper.${mode}.products-${mode}`)
            .should('be.visible');
    }
} 

export const listing = new Listing();