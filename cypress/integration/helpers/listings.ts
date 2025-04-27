/// <reference types="cypress"/>

import { product } from "./product";

const listingElements = [
    { name: 'Title', locator: '.page-title' },
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

    private clickAndVerify(locator: string, action: string) {
        cy.log(`performing ${action}`);
        cy.get(locator).click();
    }

    private selectOption(selector: string, option: string) {
        cy.log(`selecting ${option} from ${selector}`);

        cy.get(selector).select(option);
    }

    shouldContainFilterBlock() {
        cy.log('verifying filters block');

        cy.get('.sidebar-main').should('be.visible');
    }

    shouldContainAdditionalSidebar() {
        additionalSidebar.forEach(sidebar => {
            cy.log(`verifying ${sidebar} visibility`);

            cy.get('.sidebar-additional')
                .find('.block')
                .contains(sidebar)
                .should('be.visible');
        });
    }

    shouldVerifyListingElements() {
        listingElements.forEach(element => {
            cy.log(`verifying ${element}`);

            cy.get(element.locator).should('be.visible');
        });
    }

    shouldVerifyProductsNumber(number: number) {
        cy.log('verifying products number');

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
        cy.log('sorting options');

        this.selectOption('#sorter.sorter-options', sort);
    }

    shouldChangeModes(mode: string) {
        cy.log('changing modes');

        if (mode === 'list') {
            cy.get(`a.mode-${mode}`).eq(0).click({ force: true });
        }
    }

    shouldVerifyCurrentMode(mode: string) {
        cy.log(`verifying ${mode} mode`);

        cy.get(`.products.wrapper.${mode}.products-${mode}`)
            .should('be.visible');
    }

    shouldVerifySorting(sortBy: string) {
        cy.log(`verifying sorting by ${sortBy}`);

        switch (sortBy) {
            case 'Product Name':
                product.getProductName().then(text => {

                    expect(text.trim().startsWith('A')).to.be.true;
                });

                break;
            case 'Price':
                product.getPrice().should('contain', '$22.00');

                break;
            case 'Position':
                product.getProductName().should('contain', 'Breathe-Easy Tank');

                break;
        }
    }

    shouldVerifyFilterList(filter: string) {
        cy.log(`verifying filtering by ${filter}`);

        this.getFilter(filter)
            .should('be.visible')
            .get('.filter-options-content')
            .find('ol li')
            .should('have.class', 'item');
    }

    shouldVerifyFilterBlocks(filter: string, index: number) {
        cy.log(`verifying filter block - ${filter}`);

        this.getFilter(filter)
            .should('be.visible')
            .get('.swatch-attribute')
            .eq(index)
            .find('.swatch-option')
            .should('have.attr', 'option-label');
    }

    shouldBeCollapsible(filter: string) {
        cy.log('verifying filter collapsing');

        const filterElement = this.getFilter(filter);

        filterElement
            .should('have.attr', 'aria-expanded', 'false')
            .click()
            .should('have.attr', 'aria-expanded', 'true');
    }

    shouldFilter() {
        cy.log('verifying filtering');

        cy.get('.filter-options-item.allow.active')
            .find('ol li a')
            .eq(1)
            .click();
    }

    shouldFilterByAttributes(type: string, index: number) {
        cy.log(`verifying filtering by attibute ${type}`);

        cy.get('.filter-options-content')
            .find('.swatch-attribute')
            .eq(index)
            .find(`.swatch-option.${type}`)
            .first()
            .click();
    }

    shouldVerifyFilterValue() {
        cy.log('verifying filter value');

        cy.get('.filter-value').should('be.visible');
    }

    shouldClearFilters() {
        cy.log('clearing filters');

        cy.get('.filter-clear')
            .should('be.visible')
            .click();
    }
}

export const listing = new Listing();