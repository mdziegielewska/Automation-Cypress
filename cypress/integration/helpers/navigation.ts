/// <reference types="cypress"/>

import { StringLiteral } from "typescript";


class Navigation {
    private getTab(tab: string) {
        return cy.get('li.category-item').contains(tab);
    }

    private getExpandableIcon(tab: string) {
        return this.getTab(tab)
            .find('span.ui-menu-icon');
    }

    shouldContainTab(tab: string) {
        cy.log('verifying tabs in section');

        cy.get('[class="navigation"]')
            .find('[role="menuitem"]')
            .should('contain', tab);
    }

    shouldBeExpandable(tab: string) {
        cy.log('verifying expandable tabs');

        this.getExpandableIcon(tab)
            .should('exist');
    }

    shouldContainSubtab(tab: string, subtab: string) {
        cy.log('verifying subtabs in tabs');

        this.getExpandableIcon(tab)
            .first()
            .should('be.visible')
            .trigger('mouseover').as('submenu');
        
        cy.get('@submenu')
            .get('ul.submenu')
            .should('be.visible')
            .and('contain', subtab);
    }

    shouldVerifyRedirection(tab: string, url: string) {
        cy.log('verifying redirection url');

        this.getTab(tab)
            .click();

        cy.url()
            .should('contain', url);

        cy.get('#page-title-heading')
            .should('contain.text', tab);
    }
}

export const navigation = new Navigation();