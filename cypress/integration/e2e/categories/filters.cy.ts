/// <reference types="cypress"/>

import { listing } from "../../helpers/listings";


const allFilters = [
    // List filters
    { name: 'Category', type: 'list' },
    { name: 'Style', type: 'list' },
    { name: 'Climate', type: 'list' },
    { name: 'Eco Collection', type: 'list' },
    { name: 'Erin Recommends', type: 'list' },
    { name: 'Material', type: 'list' },
    { name: 'New', type: 'list' },
    { name: 'Pattern', type: 'list' },
    { name: 'Performance Fabric', type: 'list' },
    { name: 'Price', type: 'list' },
    { name: 'Sale', type: 'list' },
    // Swatch filters
    { name: 'Size', type: 'swatch', attributeType: 'text', index: 0 },
    { name: 'Color', type: 'swatch', attributeType: 'color', index: 1 }
];


describe('Categories - Filters', () => {

    beforeEach(() => {
        cy.visit('/women/tops-women.html');
    })

    allFilters.forEach((filterData) => {
        it(`Should correctly apply and clear Filter - ${filterData.name}`, () => {
            if (filterData.type === 'list') {
                listing.shouldVerifyFilterList(filterData.name);
            } else if (filterData.type === 'swatch') {
                listing.shouldVerifyFilterBlocks(filterData.name, filterData.index);
            }

            listing.shouldBeCollapsible(filterData.name);

            if (filterData.type === 'list') {
                listing.shouldFilter();
            } else if (filterData.type === 'swatch') {
                listing.shouldFilterByAttributes(filterData.attributeType, filterData.index);
            }
            listing.shouldVerifyFilterValue();

            listing.shouldClearFilters();

            cy.url()
                .should('contain', '/women/tops-women.html');
        });
    });
})