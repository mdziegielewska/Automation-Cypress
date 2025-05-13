/// <reference types="cypress"/>

import { forms } from "../../helpers/forms";
import { results } from "../../helpers/results";
import { routes } from "../../helpers/routes";
import { listing } from "../../helpers/listings";
import { search } from '../../helpers/search';
import { widgets } from "../../helpers/widgets";
import { SEARCH_SELECTORS } from "../../selectors/searchSelectors";
import { PAGE_SELECTORS } from "../../selectors/pageSelectors";


describe('Main page - Search', () => {

    it('Should Search', () => {
        routes.visitAndWait('LoadPage');

        forms.fillField(SEARCH_SELECTORS.searchField, 'jacket');
        search.shouldShowAutocomplete();

        routes.expect('SearchResult');
        forms.submit('search');

        search.shouldDisplaySearchResults();
        results.shouldVerifyTextInSection(PAGE_SELECTORS.pageTitle, 'Search results');
        listing.shouldVerifyListingElements();
    });

    it('Should verify Related Search', () => {
        cy.visit('/catalogsearch/result/?q=+Jacket');

        search.getSearchTerms('related').as('related');
        widgets.shouldVerifyNumberOfElements('@related', 5);
        search.shouldClickInSearchTerms('related');

        results.shouldVerifyTextInSection(PAGE_SELECTORS.pageTitle, 'Search results');
    });
});