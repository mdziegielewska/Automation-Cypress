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

    /**
     * Retrieves a specific filter element by its text content.
     * @param filter The text content of the filter to find (e.g., 'Category', 'Color', 'Size').
     * @returns A Cypress chainable yielding the filter element (e.g., the clickable heading).
     */
    private getFilter(filter: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(LISTING_SELECTORS.filterOptions)
            .find(LISTING_SELECTORS.filterOptionsCollapsible)
            .contains(filter);
    }

    /**
     * Selects an option from a dropdown (select) element.
     * @param selector The CSS selector for the select element.
     * @param option The value or text of the option to select.
     */
    private selectOption(selector: string, option: string): void {
        cy.log(`Selecting ${option} from ${selector}`);

        cy.get(selector)
            .select(option);
    }

    /**
     * Verifies that the main filter block (sidebar) is visible on the listing page.
     */
    shouldContainFilterBlock(): void {
        cy.log('Verifying filters block');

        cy.get(LISTING_SELECTORS.sidebarMain)
            .should('be.visible');
    }

    /**
     * Verifies that the additional sidebar blocks (Compare Products, Wish List) are visible.
     */
    shouldContainAdditionalSidebar(): void {
        additionalSidebar.forEach(sidebar => {

            cy.log(`Verifying ${sidebar} visibility`);
            cy.get(LISTING_SELECTORS.sidebarAdditional)
                .find(LISTING_SELECTORS.block)
                .contains(sidebar)
                .should('be.visible');
        });
    }

    /**
     * Verifies the visibility of core elements expected on a product listing page.
     * Uses a predefined list of element selectors (LISTING_PAGE_ELEMENTS).
     */
    shouldVerifyListingElements(): void {
        listingElements.forEach(element => {
            cy.log(`Verifying ${element.name}`);
            cy.get(element.locator)
                .should('be.visible');
        });
    }

    /**
     * Verifies the number of products displayed in the toolbar amount text.
     * @param number The expected number of products displayed.
     */
    shouldVerifyProductsNumber(number: number): void {
        cy.log('Verifying products number');

        cy.get(LISTING_SELECTORS.toolbarAmount)
            .find(LISTING_SELECTORS.toolbarNumber)
            .should('contain', `${number}`);
    }

    /**
     * Changes the number of products displayed per page using the limiter dropdown.
     * @param number The number of products to display per page (e.g., 12, 24, 36).
     */
    shouldChangeLimiter(number: number): void {
        cy.log('Verifying limiter change');

        cy.get(LISTING_SELECTORS.limiterOptions)
            .eq(1)
            .select(`${number}`)
            .wait(500);
    }

    /**
     * Selects a sorting option from the sorter dropdown.
     * @param sort The sorting option to select (e.g., 'Product Name', 'Price').
     */
    shouldSortBy(sort: string): void {
        cy.log('Sorting options');

        this.selectOption(LISTING_SELECTORS.sorterOptions, sort);
    }

    /**
     * Changes the product listing view mode (e.g., 'grid' or 'list').
     * @param mode The mode to switch to ('grid' or 'list').
     */
    shouldChangeModes(mode: string): void {
        cy.log('Changing modes');

        if (mode === 'list') {
            cy.get(LISTING_SELECTORS.modeButton(mode)).eq(0).click({ force: true });
        }
    }

    /**
     * Verifies that the product listing is currently displayed in the specified mode.
     * @param mode The mode to verify ('grid' or 'list').
     */
    shouldVerifyCurrentMode(mode: string): void {
        cy.log(`Verifying ${mode} mode`);

        cy.get(LISTING_SELECTORS.productsWrapperMode(mode))
            .should('be.visible');
    }

    /**
     * Verifies that the product listing is sorted correctly based on the selected sorting option.
     * @param sortBy The sorting option that was applied ('Product Name', 'Price', 'Position').
     */
    shouldVerifySorting(sortBy: string): void {
        cy.log(`Verifying sorting by ${sortBy}`);

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

    /**
     * Verifies that a specific filter option list is visible and contains list items.
     * @param filter The text content of the filter heading (e.g., 'Category').
     */
    shouldVerifyFilterList(filter: string): void {
        cy.log(`Verifying filtering by ${filter}`);

        this.getFilter(filter)
            .should('be.visible')
            .get(LISTING_SELECTORS.filterOptionsContent)
            .find(LISTING_SELECTORS.filterListItem)
            .should('have.class', 'item');
    }

    /**
     * Verifies that a specific filter block within a filter option list is visible
     * and contains swatch options with the 'option-label' attribute.
     * @param filter The text content of the filter heading (e.g., 'Color', 'Size').
     * @param index The index of the swatch attribute block within the filter content (use if a filter has multiple swatch blocks).
     */
    shouldVerifyFilterBlocks(filter: string, index: number): void {
        cy.log(`Verifying filter block - ${filter}`);

        this.getFilter(filter)
            .should('be.visible')
            .get(LISTING_SELECTORS.swatchAttribute)
            .eq(index)
            .find(LISTING_SELECTORS.swatchOption)
            .should('have.attr', 'option-label');
    }

    /**
     * Verifies that a specific filter block is collapsible and can be expanded and collapsed.
     * @param filter The text content of the filter heading to test collapsing/expanding.
     */
    shouldBeCollapsible(filter: string): void {
        cy.log('Verifying filter collapsing');

        const filterElement = this.getFilter(filter);

        filterElement
            .should('have.attr', 'aria-expanded', 'false')
            .click()
            .should('have.attr', 'aria-expanded', 'true');
    }

    /**
     * Clicks the second filter option within the active filter list.
     * Assumes a filter has been selected and its options are visible.
     */
    shouldFilter(): void {
        cy.log('Verifying filtering');

        cy.get(LISTING_SELECTORS.filterOptionsItemActive)
            .find(LISTING_SELECTORS.filterLinks)
            .eq(1)
            .click();
    }

    /**
     * Filters the product listing by clicking a specific swatch option within a filter attribute block.
     * @param type The type of swatch option (e.g., 'color', 'size') which corresponds to a class name.
     * @param index The index of the filter attribute block containing the swatch (use if a filter has multiple).
     */
    shouldFilterByAttributes(type: string, index: number): void {
        cy.log(`Verifying filtering by attribute ${type}`);

        cy.get(LISTING_SELECTORS.filterOptionsContent)
            .find(LISTING_SELECTORS.swatchAttribute)
            .eq(index)
            .find(`${LISTING_SELECTORS.swatchOption}.${type}`)
            .first()
            .click();
    }

    /**
     * Verifies that the active filter value is visible in the applied filters section.
     * Assumes that applying a filter adds a visible indicator/element.
     */
    shouldVerifyFilterValue(): void {
        cy.log('Verifying filter value');

        cy.get(LISTING_SELECTORS.filterValue).should('be.visible');
    }

    /**
     * Clicks the button to clear all applied filters.
     */
    shouldClearFilters(): void {
        cy.log('Clearing filters');

        cy.get(LISTING_SELECTORS.filterClear)
            .should('be.visible')
            .click();
    }
}

export const listing = new Listing();