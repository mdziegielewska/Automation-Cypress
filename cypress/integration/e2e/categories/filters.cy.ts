/// <reference types="cypress"/>

import { listing } from "../../helpers/listings";


const listingFilters = [ 'Category', 'Style', 'Climate', 'Eco Collection', 'Erin Recommends', 
    'Material', 'New', 'Pattern', 'Performance Fabric', 'Price', 'Sale' ];

const swatchFilters = [ 
    { name: 'Size', type: 'text' },
    { name: 'Color', type: 'color' } 
];


describe('Filters', () => {

    beforeEach(() => {
        
        cy.visit('/women/tops-women.html');
    })

    listingFilters.forEach((filter) => {
        it(`Should contain list filters - ${filter}`, () => {

            listing.shouldVerifyFilterList(filter);

            listing.shouldBeCollapsible(filter);
            listing.shouldFilter();
            listing.shouldVerifyFilterValue();

            listing.shouldClearFilters();

            cy.url()
                .should('contain', '/women/tops-women.html');
        })
    })

    swatchFilters.forEach(({ name, type }, index) => {
        it(`Should contain block filters - ${name}`, () => {

            listing.shouldVerifyFilterBlocks(name, index);

            listing.shouldBeCollapsible(name);
            listing.shouldFilterByAttributes(type, index);
            listing.shouldVerifyFilterValue();

            listing.shouldClearFilters();

            cy.url()
                .should('contain', '/women/tops-women.html');
        })
    })
})