/// <reference types="cypress"/>

import { routes } from "./routes";
import { SEARCH_SELECTORS } from "../selectors/selectors";


class Search {

    advancedSearch() {
        cy.get(SEARCH_SELECTORS.searchButton)
            .should('be.visible')
            .click();
    }

    shouldShowAutocomplete() {
        cy.log('verifying autocomplete search');

        cy.get(SEARCH_SELECTORS.autocomplete)
            .should('be.visible');
    }

    shouldDisplaySearchResults() {
        cy.log('verifying display search results visibility');

        cy.get(SEARCH_SELECTORS.searchResults)
            .should('be.visible');
    }

    getSearchTerms(type: string) {
        cy.log('getting search terms');

        switch (type) {
            case 'related':
                return cy.get(SEARCH_SELECTORS.relatedSearchTerms);
            case 'popular':
                return cy.get(SEARCH_SELECTORS.popularSearchTerms);

            default: throw Error(`Unknown search terms type: ${type}`)
        }
    }

    shouldClickInSearchTerms(type: string) {
        cy.log('clicking on search terms');

        this.getSearchTerms(type)
            .should('be.visible')
            .first()
            .click();

        routes.expect('SearchResults');
    }
}

export const search = new Search();