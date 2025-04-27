/// <reference types="cypress"/>

import { forms } from "../../helpers/forms";
import { navigation } from "../../helpers/navigation";
import { product } from "../../helpers/product";
import { results } from "../../helpers/results";
import { search } from "../../helpers/search";
import { widgets } from '../../helpers/widgets';


const footer = [
    { footer: 'Search Terms', url: '/search/term/popular/' },
    { footer: 'Privacy and Cookie Policy', url: '/privacy-policy-cookie-restriction-mode' },
    { footer: 'Advanced Search', url: '/catalogsearch/advanced/' },
    { footer: 'Orders and Returns', url: '/sales/guest/form/' }
];

const oar = [
    { id: 'oar-order-id', value: `${Cypress.env("ORDER_NUMBER")}` },
    { id: 'oar-billing-lastname', value: `${Cypress.env("TEST_LAST_NAME")}` },
    { id: 'oar_email', value: `${Cypress.env("TEST_USER_EMAIL")}` }
];

const SEARCH_RESULT_MESSAGE = 'Don\'t see what you\'re looking for?';
const isEquipment = false;


describe('Footer', () => {

    const footerPanel = '.footer.links li';
    const title = '.page-title';

    footer.forEach(({ footer, url }) => {
        it(`Should verify footer links - ${footer}`, () => {

            cy.visit('/');

            widgets.shouldVerifyNumberOfElements(footerPanel, 4);
            navigation.shouldVerifyFooter(footer, url);
        })
    })

    it('Should verify Popular Search Terms', () => {

        cy.visit('/search/term/popular/');

        results.shouldVerifyPageTitle('Popular Search Terms');

        search.shouldClickInSearchTerms('popular');

        results.shouldVerifyPageTitle('Search results');
        product.shouldVerifyProductCellElements(isEquipment);
    })

    it('Should verify Privacy Policy', () => {

        cy.visit('/privacy-policy-cookie-restriction-mode');

        results.shouldVerifyPageTitle('Privacy Policy');

        navigation.shouldContainNavPanel('#privacy-policy-nav-content');
        results.shouldVerifyTextInSection('.privacy-policy-content', '.');
    })

    it('Should verify Advanced Search', () => {

        cy.visit('/catalogsearch/advanced/');

        results.shouldVerifyTextInSection(title, 'Advanced Search');

        forms.fillField('sku', 'WT09');
        search.advancedSearch();

        results.shouldVerifyTextInSection(title, 'Catalog Advanced Search');
        product.shouldVerifyProductCellElements(isEquipment);
        results.shouldVerifyPageMessage(SEARCH_RESULT_MESSAGE);
    })

    it('Should verify Orders and Returns', () => {

        cy.visit('/sales/guest/form/');

        results.shouldVerifyTextInSection(title, 'Orders and Returns');

        for (const elem of oar) {
            forms.fillField(elem.id, elem.value);
        }

        forms.submit('submit');

        results.shouldVerifyTextInSection(title, `Order # ${Cypress.env("ORDER_NUMBER")}`);
    })
})