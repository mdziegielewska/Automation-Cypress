/// <reference types="cypress"/>

import { product } from "./product";

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
    private getFilter(filter: string) {
        return cy.get('.filter-options')
            .find('[data-role="collapsible"]')
            .contains(filter);
    }

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

    shouldVerifySorting(sortBy: string) {
        cy.log(`verifying sorting by ${sortBy}`);

        if(sortBy == 'Product Name') {
            product.getProductName()
                .then(text => {
                    expect(text.trim().startsWith('A')).to.be.true; 
            })
        } else if(sortBy == 'Price') {
            product.getPrice()
                .should('contain', '$22.00');
        } else if(sortBy == 'Position') {
            product.getProductName()
                .should('contain', 'Breathe-Easy Tank');
        }
    }

    shouldVerifyFilterList(filter: string){
        cy.log('verifying filter');

        this.getFilter(filter)
            .should('be.visible');

        this.getFilter(filter)
            .get('.filter-options-content')
            .find('ol li')
            .should('have.class', 'item');
    }

    shouldVerifyFilterBlocks(filter: string, index: number){
        cy.log('verifying filter block');

        this.getFilter(filter)
            .should('be.visible');

        this.getFilter(filter)
            .get('.swatch-attribute')
            .eq(index)
            .find('.swatch-option')
            .should('have.attr', 'option-label');
    }

    shouldBeCollapsible(filter: string) {
        cy.log('verifying filter collapsing')

        this.getFilter(filter)
            .should('have.attr', 'aria-expanded', 'false')
            .click()
            .wait(500)
            .should('have.attr', 'aria-expanded', 'true');
    }

    shouldFilter(filter: string){
        cy.log('verifying filtering by list');

        cy.get('.filter-options-item.allow.active')
            .find('ol li a')
            .eq(1)
            .click()
            .wait(500); 
    }

    shouldFilterByAttributes(filter: string, type: string, index: number) {
        cy.log('verifying filtering by attributes');

        cy.get('.filter-options-content')
            .find('.swatch-attribute')
            .eq(index)
            .find(`.swatch-option.${type}`)
            .first()
            .click()
            .wait(500);
    }

    shouldVerifyFilterValue() {
        cy.log('verifying filter value');
            
        cy.get('.filter-value')
            .should('be.visible');
    }

    shouldClearFilters() {
        cy.log('clearing filters');

        cy.get('.filter-clear')
            .should('be.visible')
            .click();
    }
} 

export const listing = new Listing();