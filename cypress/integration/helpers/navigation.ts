/// <reference types="cypress"/>

import { NAVIGATION_SELECTORS } from "../selectors/selectors";


class Navigation {

    /**
     * Gets the Cypress chainable for a specific navigation tab element.
     * @param tab - The name or identifier of the tab.
     * @returns A Cypress chainable for the tab element.
     */
    private getTab(tab: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(NAVIGATION_SELECTORS.tab(tab));
    }

    /**
     * Gets the Cypress chainable for the expandable icon associated with a tab.
     * This icon typically indicates that the tab has a dropdown or sub-menu.
     * @param tab - The name or identifier of the tab.
     * @returns A Cypress chainable for the expandable icon element.
     */
    private getExpandableIcon(tab: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(NAVIGATION_SELECTORS.expandableIcon(tab));
    }

    /**
     * Verifies a navigation link by finding it within a specified locator, clicking it,
     * and asserting that the URL contains the expected value.
     * @param locator - The CSS selector for the container of the navigation links (e.g., header, footer).
     * @param name - The visible text of the navigation link.
     * @param url - The expected substring in the URL after clicking the link.
     */
    private verifyNavigation(locator: string, name: string, url: string) {
        cy.log(`Verifying if Navigation Link ${name} redirects to ${url} `);

        cy.get(locator)
            .contains(name)
            .should('be.visible')
            .click();

        cy.url()
            .should('contain', url);
    }

    /**
     * Verifies that the navigation menu contains a specific tab by its text content.
     * @param tab - The expected text content of the tab.
     */
    shouldContainTab(tab: string): void {
        cy.log(`Verifying Tab ${tab} in Section`);

        cy.get(NAVIGATION_SELECTORS.navigationMenu)
            .find(NAVIGATION_SELECTORS.menuItem)
            .should('contain', tab);
    }

    /**
     * Verifies that a specific tab has an expandable icon, indicating it can be expanded to show sub-menus.
     * @param tab - The name or identifier of the tab to check.
     */
    shouldBeExpandable(tab: string): void {
        cy.log(`Verifying if Tab ${tab} is expandable`);

        this.getExpandableIcon(tab)
            .should('exist');
    }

    /**
     * Verifies that a first-level subtab exists within an expandable main tab's menu after hovering.
     * Hovers over the main tab's expandable icon and asserts the sub-menu and subtab visibility/content.
     * @param tab - The name or identifier of the main tab (level 0).
     * @param subtab - The expected text content of the first-level subtab (level 1).
     * @returns A Cypress chainable for the main tab element after triggering mouseover.
     */
    shouldContainSubtabLevel1(tab: string, subtab: string): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log(`Verifying Subtabs for Tab ${tab}`);

        this.getExpandableIcon(tab)
            .should('be.visible')
            .first()
            .trigger('mouseover').as('submenu');

        return cy.get('@submenu')
            .get(NAVIGATION_SELECTORS.subMenu)
            .should('be.visible')
            .and('contain', subtab).as('subsubmenu');
    }

    /**
     * Verifies that a second-level subtab exists within a first-level subtab's menu after expanding.
     * Builds upon `shouldContainSubtabLevel1` and then checks for the second-level subtab within the first-level sub-menu.
     * Assumes `shouldContainSubtabLevel1` has already been called and set the `@subsubmenu` alias.
     * @param tablevel0 - The name or identifier of the main tab (level 0).
     * @param tab - The expected text content of the first-level subtab (level 1).
     * @param subtab - The expected text content of the second-level subtab (level 2).
     */
    shouldContainSubtabLevel2(tablevel0: string, tab: string, subtab: string): void {
        cy.log(`Verifying Level2 Subtabs for Subtab ${subtab}`);

        this.shouldContainSubtabLevel1(tablevel0, tab);

        cy.get('@subsubmenu')
            .get(NAVIGATION_SELECTORS.subMenu)
            .should('be.visible')
            .and('contain', subtab);
    }

    /**
     * Verifies that clicking a tab redirects the user to the correct URL and updates the page title.
     * @param tab - The name or identifier of the tab to click.
     * @param url - The expected substring in the URL after clicking.
     */
    shouldVerifyTabRedirection(tab: string, url: string): void {
        cy.log('Verifying Redirection Url');

        this.getTab(tab)
            .click();

        cy.url()
            .should('contain', url);

        cy.get(NAVIGATION_SELECTORS.pageTitleHeading)
            .should('contain.text', tab);
    }

    /**
     * Verifies navigation links found in the header section.
     * Uses the private `verifyNavigation` helper.
     * @param navigationLink - The text of the header link.
     * @param url - The expected URL substring after clicking.
     */
    shouldVerifyNavigationLinks(navigationLink: string, url: string): void {
        cy.log('Verifying Navigation Links');

        this.verifyNavigation(NAVIGATION_SELECTORS.headerLinks, navigationLink, url);
    }

    /**
     * Verifies navigation links found in the footer section.
     * Uses the private `verifyNavigation` helper.
     * @param footer - The text of the footer link.
     * @param url - The expected URL substring after clicking.
     */
    shouldVerifyFooter(footer: string, url: string): void {
        cy.log('Verifying Footer Links');

        this.verifyNavigation(NAVIGATION_SELECTORS.footerLinks, footer, url);
    }

    /**
     * Verifies that a specific navigation panel is visible.
     * @param nav - The identifier or name of the navigation panel.
     */
    shouldContainNavPanel(nav: string): void {
        cy.log(`Verifying Nav Panel ${nav} visibility`);

        cy.get(NAVIGATION_SELECTORS.navPanel(nav))
            .should('be.visible');
    }

    /**
     * Confirms a generic modal by finding and clicking the 'OK' button within it.
     */
    shouldConfirmModal(): void {
        cy.log('Confirming modal');

        cy.get(NAVIGATION_SELECTORS.confirmButton)
            .contains('OK')
            .click();
    }
}

export const navigation = new Navigation();