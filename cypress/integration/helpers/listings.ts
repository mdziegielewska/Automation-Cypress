/// <reference types="cypress"/>

class Listing {
    
    shouldVerifyListingElements(locator: string) {
        cy.log('verifying listing elements');

        cy.get(locator)
            .should('be.visible');
    }
} 

export const listing = new Listing();