/// <reference types="cypress"/>

import { routes } from "./routes";

class Search {
    advancedSearch() {
        cy.get('.actions-toolbar')
            .find(`.search`)
            .should('be.visible')
            .click();
    }

    shouldShowAutocomplete(){
        cy.log('verifying autocomplete search');

        cy.get('#search_autocomplete')
            .should('be.visible');
    }

    shouldDisplaySearchResults() {
        cy.log('verifying display search results visibility');
        
        cy.get('.search.results')
            .should('be.visible');
    }

    getSearchTerms(type: string) {
        cy.log('getting search terms');

        switch(type) {
            case 'related': 
                return cy.get('.block')
                        .find('dd.item');
            case 'popular': 
                return cy.get('.search-terms')
                        .find('li.item');

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