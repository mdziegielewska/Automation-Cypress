/// <reference types="cypress"/>


import { forms } from "../../helpers/forms";
import { results } from "../../helpers/results";
import { routes } from "../../helpers/routes";
import { listing } from "../../helpers/listings";
import { search } from '../../helpers/search';
import { widgets } from "../../helpers/widgets";


describe('Main page - Search', () => {

    it('Should search', () => {

        cy.visit('/');

        forms.fillField('search', 'jacket');
        search.shouldShowAutocomplete();

        forms.submit('search');

        routes.expect('SearchResults');

        search.shouldDisplaySearchResults();
        results.shouldVerifyTextInSection('.page-title', 'Search results');
        listing.shouldVerifyListingElements();
    })

    it('Should verify Related Search', () => {

        cy.visit('/catalogsearch/result/?q=+Jacket');

        search.getSearchTerms('related').as('related');
        widgets.shouldVerifyNumberOfElements('@related', 5);

        search.shouldClickInSearchTerms('related');

        results.shouldVerifyTextInSection('.page-title', 'Search results');
    })

})