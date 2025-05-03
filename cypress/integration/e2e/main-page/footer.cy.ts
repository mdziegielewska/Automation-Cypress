/// <reference types="cypress"/>

import { forms } from "../../helpers/forms";
import { navigation } from "../../helpers/navigation";
import { product } from "../../helpers/product";
import { results } from "../../helpers/results";
import { routes } from "../../helpers/routes";
import { search } from "../../helpers/search";
import { widgets } from '../../helpers/widgets';
import { NAVIGATION_SELECTORS } from "../../selectors/selectors";


const footerLinksData = [
    { footer: 'Search Terms', url: '/search/term/popular/' },
    { footer: 'Privacy and Cookie Policy', url: '/privacy-policy-cookie-restriction-mode' },
    { footer: 'Advanced Search', url: '/catalogsearch/advanced/' },
    { footer: 'Orders and Returns', url: '/sales/guest/form/' }
];

const oarFormData = [
    { field: NAVIGATION_SELECTORS.orderIdField, value: `${Cypress.env("ORDER_NUMBER")}` },
    { field: NAVIGATION_SELECTORS.billingLastnameField, value: `${Cypress.env("TEST_LAST_NAME")}` },
    { field: NAVIGATION_SELECTORS.emailField, value: `${Cypress.env("TEST_USER_EMAIL")}` }
];

const SEARCH_RESULT_MESSAGE = 'Don\'t see what you\'re looking for?';
const isEquipment = false;


describe('Main Page - Footer', () => {

    describe('Footer Links Verification', () => {
        beforeEach(() => {
            routes.visitAndWait('LoadPage');
            widgets.shouldVerifyNumberOfElements(NAVIGATION_SELECTORS.footerPanel, 4);
        })

        footerLinksData.forEach(({ footer, url }) => {
            it(`Should verify Footer Links - ${footer}`, () => {
                navigation.shouldVerifyFooter(footer, url);
            })
        })
    })

    it('Should verify Popular Search Terms', () => {
        routes.visitAndWait('SearchTerms');
        results.shouldVerifyPageTitle('Popular Search Terms');

        search.shouldClickInSearchTerms('popular');

        results.shouldVerifyPageTitle('Search results');
        product.shouldVerifyProductCellElements(isEquipment);
    })

    it('Should verify Privacy Policy', () => {
        routes.visitAndWait('PrivacyPolicyPage');
        results.shouldVerifyPageTitle('Privacy Policy');

        navigation.shouldContainNavPanel(NAVIGATION_SELECTORS.privacyPolicyNavPanel);
        results.shouldVerifyTextInSection(NAVIGATION_SELECTORS.privacyPolicyContent, '.');
    })

    it('Should verify Advanced Search', () => {
        routes.visitAndWait('AdvancedSearchPage');
        results.shouldVerifyTextInSection(NAVIGATION_SELECTORS.title, 'Advanced Search');

        forms.fillField('sku', 'WT09');
        search.advancedSearch();

        results.shouldVerifyTextInSection(NAVIGATION_SELECTORS.title, 'Catalog Advanced Search');
        product.shouldVerifyProductCellElements(isEquipment);
        results.shouldVerifyPageMessage(SEARCH_RESULT_MESSAGE);
    })

    it('Should verify Orders and Returns', () => {
        routes.visitAndWait('OrdersReturnsPage');
        results.shouldVerifyTextInSection(NAVIGATION_SELECTORS.title, 'Orders and Returns');

        forms.fillOarFields(oarFormData);

        routes.expect('OrdersReturnsResult');
        forms.submit('submit');

        results.shouldVerifyTextInSection(NAVIGATION_SELECTORS.title, `Order # ${Cypress.env("ORDER_NUMBER")}`);
    })
})