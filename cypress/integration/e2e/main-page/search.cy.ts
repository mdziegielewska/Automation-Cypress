/// <reference types="cypress"/>


import { forms } from "../../helpers/forms";
import { results } from "../../helpers/results";
import { routes } from "../../helpers/routes";
import { listing } from "../../helpers/listings";
import { search } from "../../helpers/search";
import { widgets } from "../../helpers/widgets";


const searchResultsElements = [
    { name: 'Title', locator: '.page-title'  },
    { name: 'Toolbar', locator: '.toolbar-products' },
    { name: 'Related search', locator: '.block' },
    { name: 'Results', locator: '.product-items' },
    { name: 'Filters', locator: '#layered-filter-block' },
    { name: 'Compare section', locator: '#block-compare-heading' },
    { name: 'Wishlist section', locator: '.block-wishlist' }
];


describe('Main page - Search', () => {

    it('Should search', () => {
        cy.visit('/');

        forms.fillField('search', 'jacket');
        search.shouldShowAutocomplete();

        forms.submit('search');

        routes.expect('SearchResults');

        search.shouldDisplaySearchResults();
        results.shouldVerifyTextInSection('.page-title', 'Search results');
    })

    beforeEach(() => {
        cy.visit('/catalogsearch/result/?q=+Jacket');
    })

    searchResultsElements.forEach(({name, locator}) => {
        it(`Should result should contain - ${name}`, () => {

            listing.shouldVerifyListingElements(locator);
        })
    })

    it('Should verify Related Search Terms', () => {

        cy.get('.block')
            .find('dd.item').as('related');

        widgets.shouldVerifyNumberOfElements('@related', 5);

        search.shouldClickInRelatedSearch();

        results.shouldVerifyTextInSection('.page-title', 'Search results');
    })

})