/// <reference types="cypress"/>

import { routes } from "./routes";

class Search {
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

    shouldClickInRelatedSearch() {
        cy.log('verifying related search');

        cy.get('.block')
            .find('dd.item')
            .first()
            .click();

        routes.expect('SearchResults');
    }
} 

export const search = new Search();