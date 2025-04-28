/// <reference types="cypress"/>

import { product } from "./product";
import { LISTING_SELECTORS } from "../selectors/selectors";


const listingElements = [
    { name: 'Title', locator: LISTING_SELECTORS.pageTitle },
    { name: 'Toolbar', locator: LISTING_SELECTORS.toolbarProducts },
    { name: 'Results', locator: LISTING_SELECTORS.productItems },
    { name: 'Filters', locator: LISTING_SELECTORS.filtersBlock },
    { name: 'Compare section', locator: LISTING_SELECTORS.compareSection },
    { name: 'Wishlist section', locator: LISTING_SELECTORS.wishlistSection }
];

const additionalSidebar = ['Compare Products', 'My Wish List'];


class Listing {

    private getFilter(filter: string) {
        return cy.get(LISTING_SELECTORS.filterOptions)
            .find(LISTING_SELECTORS.filterOptionsCollapsible)
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

        cy.get(LISTING_SELECTORS.sidebarMain).should('be.visible');
    }

    shouldContainAdditionalSidebar() {
        additionalSidebar.forEach(sidebar => {

            cy.log(`verifying ${sidebar} visibility`);
            cy.get(LISTING_SELECTORS.sidebarAdditional)
                .find(LISTING_SELECTORS.block)
                .contains(sidebar)
                .should('be.visible');
        });
    }

    shouldVerifyListingElements() {
        listingElements.forEach(element => {

            cy.log(`verifying ${element.name}`);
            cy.get(element.locator).should('be.visible');
        });
    }

    shouldVerifyProductsNumber(number: number) {
        cy.log('verifying products number');

        cy.get(LISTING_SELECTORS.toolbarAmount)
            .find(LISTING_SELECTORS.toolbarNumber)
            .should('contain', `${number}`);
    }

    shouldChangeLimiter(number: number) {
        cy.log('verifying limiter change');

        cy.get(LISTING_SELECTORS.limiterOptions)
            .eq(1)
            .select(`${number}`)
            .wait(500);
    }

    shouldSortBy(sort: string) {
        cy.log('sorting options');

        this.selectOption(LISTING_SELECTORS.sorterOptions, sort);
    }

    shouldChangeModes(mode: string) {
        cy.log('changing modes');

        if (mode === 'list') {

            cy.get(LISTING_SELECTORS.modeButton(mode)).eq(0).click({ force: true });
        }
    }

    shouldVerifyCurrentMode(mode: string) {
        cy.log(`verifying ${mode} mode`);

        cy.get(LISTING_SELECTORS.productsWrapperMode(mode))
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
            .get(LISTING_SELECTORS.filterOptionsContent)
            .find('ol li')
            .should('have.class', 'item');
    }

    shouldVerifyFilterBlocks(filter: string, index: number) {
        cy.log(`verifying filter block - ${filter}`);

        this.getFilter(filter)
            .should('be.visible')
            .get(LISTING_SELECTORS.swatchAttribute)
            .eq(index)
            .find(LISTING_SELECTORS.swatchOption)
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

        cy.get(LISTING_SELECTORS.filterOptionsItemActive)
            .find('ol li a')
            .eq(1)
            .click();
    }

    shouldFilterByAttributes(type: string, index: number) {
        cy.log(`verifying filtering by attribute ${type}`);

        cy.get(LISTING_SELECTORS.filterOptionsContent)
            .find(LISTING_SELECTORS.swatchAttribute)
            .eq(index)
            .find(`${LISTING_SELECTORS.swatchOption}.${type}`)
            .first()
            .click();
    }

    shouldVerifyFilterValue() {
        cy.log('verifying filter value');

        cy.get(LISTING_SELECTORS.filterValue).should('be.visible');
    }

    shouldClearFilters() {
        cy.log('clearing filters');

        cy.get(LISTING_SELECTORS.filterClear)
            .should('be.visible')
            .click();
    }
}

export const listing = new Listing();