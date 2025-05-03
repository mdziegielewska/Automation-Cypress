/// <reference types="cypress"/>

import { routes } from "./routes";
import { SEARCH_SELECTORS } from "../selectors/selectors";


class Search {

    /**
     * Performs a search by clicking the search button and waits for the result
     */
    advancedSearch(): void {
        cy.log('Performing Advanced Search');

        routes.expect('AdvancedSearchResult');
        cy.get(SEARCH_SELECTORS.searchButton)
            .should('be.visible')
            .click();
    }

    /**
     *  Verifies that the autocomplete search element is visible
     */
    shouldShowAutocomplete(): void {
        cy.log('Verifying autocomplete Search');

        cy.get(SEARCH_SELECTORS.autocomplete)
            .should('be.visible');
    }

    /**
     *  Verifies that the search results are visible
     */
    shouldDisplaySearchResults(): void {
        cy.log('Verifying display Search Results visibility');

        cy.get(SEARCH_SELECTORS.searchResults)
            .should('be.visible');
    }

    /**
     * Gets search terms based on the specified type.
     * @param type - The type of search terms ('related' or 'popular').
     * @returns A Cypress chainable for the selected search terms.
     * @throws Error if an unknown search terms type is provided.
     */
    getSearchTerms(type: string): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log(`Getting Search Term type - ${type}`);

        switch (type) {
            case 'related':
                return cy.get(SEARCH_SELECTORS.relatedSearchTerms);
            case 'popular':
                return cy.get(SEARCH_SELECTORS.popularSearchTerms);

            default: throw Error(`Unknown search terms type: ${type}`)
        }
    }

    /**
     * Clicks on the first visible search term of the specified type and waits for the search result.
     * @param type - The type of search terms ('related' or 'popular') to click on.
     */
    shouldClickInSearchTerms(type: string): void {
        cy.log('Clicking on Search Terms');

        routes.expect('SearchResult');
        this.getSearchTerms(type)
            .should('be.visible')
            .first()
            .click();
    }
}

export const search = new Search();