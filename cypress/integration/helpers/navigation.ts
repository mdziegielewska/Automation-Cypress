/// <reference types="cypress"/>


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

    shouldContainSubtabLevel1(tab: string, subtab: string) {
        cy.log('verifying subtabs in tabs');

        this.getExpandableIcon(tab)
            .should('be.visible')
            .should('exist')
            .trigger('mouseover').as('submenu');
        
        cy.get('@submenu')
            .get(`ul.submenu`)
            .should('be.visible')
            .and('contain', subtab).as('subsubmenu');

        return '@submenu';
    }

    shouldContainSubtabLevel2(tablevel0: string, tab: string, subtab: string) {
        cy.log('verifying level2 subtabs in tabs');

        this.shouldContainSubtabLevel1(tablevel0, tab);
   
        cy.get('@subsubmenu')
            .get(`ul.submenu`)
            .should('be.visible')
            .and('contain', subtab);
    }

    shouldVerifyTabRedirection(tab: string, url: string) {
        cy.log('verifying redirection url');

        this.getTab(tab)
            .click();

        cy.url()
            .should('contain', url);

        cy.get('#page-title-heading')
            .should('contain.text', tab);
    }

    shouldVerifyNavigationLinks(navigationLink: string, url: string) {
        cy.log('verifying navigation links'); 

        cy.get('ul.header.links a')
            .contains(navigationLink)
            .should('be.visible')
            .click();

        cy.url().should('contain', url);
    }

    shouldVerifyFooter(footer: string, url: string) {
        cy.log('verifying navigation links'); 

        cy.get('ul.footer.links a')
            .contains(footer)
            .should('be.visible')
            .click();

        cy.url().should('contain', url);
    }

    shouldContainNavPanel(nav: string) {
        cy.get(nav)
            .should('be.visible');
    }
}

export const navigation = new Navigation();