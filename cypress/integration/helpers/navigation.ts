/// <reference types="cypress"/>

import { NAVIGATION_SELECTORS } from "../selectors/selectors";


class Navigation {

    private getTab(tab: string) {
        return cy.get(NAVIGATION_SELECTORS.tab(tab));
    }

    private getExpandableIcon(tab: string) {
        return cy.get(NAVIGATION_SELECTORS.expandableIcon(tab));
    }

    private verifyNavigation(locator: string, name: string, url: string) {
        cy.log(`verifying navigation link for ${name}`);

        cy.get(locator)
            .contains(name)
            .should('be.visible')
            .click();

        cy.url().should('contain', url);
    }

    shouldContainTab(tab: string) {
        cy.log('verifying tabs in section');

        cy.get(NAVIGATION_SELECTORS.navigationMenu)
            .find(NAVIGATION_SELECTORS.menuItem)
            .should('contain', tab);
    }

    shouldBeExpandable(tab: string) {
        cy.log('verifying expandable tabs');

        this.getExpandableIcon(tab)
            .should('exist');
    }

    shouldContainSubtabLevel1(tab: string, subtab: string) {
        cy.log('verifying subtabs in tabs');

        this.getExpandableIcon(tab)
            .should('be.visible')
            .should('exist')
            .trigger('mouseover').as('submenu');

        cy.get('@submenu')
            .get(NAVIGATION_SELECTORS.subMenu)
            .should('be.visible')
            .and('contain', subtab).as('subsubmenu');

        return '@submenu';
    }

    shouldContainSubtabLevel2(tablevel0: string, tab: string, subtab: string) {
        cy.log('verifying level2 subtabs in tabs');

        this.shouldContainSubtabLevel1(tablevel0, tab);

        cy.get('@subsubmenu')
            .get(NAVIGATION_SELECTORS.subMenu)
            .should('be.visible')
            .and('contain', subtab);
    }

    shouldVerifyTabRedirection(tab: string, url: string) {
        cy.log('verifying redirection url');

        this.getTab(tab)
            .click();

        cy.url()
            .should('contain', url);

        cy.get(NAVIGATION_SELECTORS.pageTitleHeading)
            .should('contain.text', tab);
    }

    shouldVerifyNavigationLinks(navigationLink: string, url: string) {
        cy.log('verifying navigation links');

        this.verifyNavigation(NAVIGATION_SELECTORS.headerLinks, navigationLink, url);
    }

    shouldVerifyFooter(footer: string, url: string) {
        cy.log('verifying navigation links');

        this.verifyNavigation(NAVIGATION_SELECTORS.footerLinks, footer, url);
    }

    shouldContainNavPanel(nav: string) {
        cy.log('verifying nav panel visibility');

        cy.get(NAVIGATION_SELECTORS.navPanel(nav))
            .should('be.visible');
    }
}

export const navigation = new Navigation();