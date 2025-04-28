/// <reference types="cypress"/>

import { WIDGETS_SELECTORS } from "../selectors/selectors";


class Widgets {

    getGridWidget() {
        cy.log('getting hot sellers widget');

        return cy.get(WIDGETS_SELECTORS.gridWidget)
            .should('be.visible')
            .find(WIDGETS_SELECTORS.productItem);
    }

    shouldVerifyNumberOfElements(section: string, number: number) {
        cy.log('verifying number of element');

        cy.get(section)
            .should('have.length', number);
    }

    shouldVerifyUrl(element: string, index: number, url: string) {
        cy.log('verifying redirection url');

        cy.get(element)
            .eq(index)
            .click();

        cy.url().should('include', url);
    }

    shouldVerifyWidgetInfo(index: number, info: string) {
        cy.log('verifying widget info');

        cy.get(WIDGETS_SELECTORS.info)
            .eq(index)
            .and('contain', info);
    }
}

export const widgets = new Widgets();