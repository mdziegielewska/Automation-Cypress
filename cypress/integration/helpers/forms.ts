/// <reference types="cypress"/>

class Forms {

    /**
     * Fills a text input field.
     * @param field The ID of the input field.
     * @param value The value to type into the field.
     */
    fillField(field: string, value: string): void {
        cy.log('filling form field');

        cy.get(`#${field}`)
            .type(value);
    }

    /**
     * Selects a value from a dropdown (select) field.
     * Assumes the element has the class 'select'.
     * @param field The selector for the select element.
     * @param value The value to select from the dropdown options.
     */
    selectValue(field: string, value: string): void {
        cy.log(`Selecting ${value}`);

        cy.get(field)
            .should('have.class', 'select')
            .select(value)
    }

    /**
     * Submits a form by clicking a submit button with a specific class.
     * @param action The class of the submit button to click (e.g., 'primary', 'action').
     */
    submit(action: string): void {
        cy.log('submitting form');

        cy.get('button[type="submit"]')
            .filter(`.${action}`)
            .should('be.visible')
            .click();
    }
}

export const forms = new Forms();