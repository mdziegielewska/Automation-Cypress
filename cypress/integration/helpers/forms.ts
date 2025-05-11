/// <reference types="cypress"/>

class Forms {

    /**
     * Fills a text input field.
     * @param field The ID of the input field.
     * @param value The value to type into the field.
     */
    fillField(field: string, value: string): void {
        cy.log('Filling form field');

        cy.get(`${field}`).type(value);
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
            .should('not.be.empty')
            .select(value);
    }

    /**
     * Submits a form by clicking a submit button with a specific class.
     * @param action The class of the submit button to click (e.g., 'primary', 'action').
     */
    submit(action: string): void {
        cy.log('Submitting form');

        cy.get('button[type="submit"]')
            .filter(`.${action}`)
            .should('be.visible')
            .click();
    }

    /**
     * Fills Orders and Returns form.
     * @param field The ID of the input field.
     * @param value The value to type into the field.
     */
    fillOarFields(oarFormData: { field: string, value: string }[]): void {
        cy.log('Filling Order and Returns Form');

        oarFormData.forEach(({ field, value }) => {
            this.fillField(field, value);
        });
    };

    /**
     * Fills out the shipping address form by entering values into input fields and selecting dropdown values.
     * @param {Object} addressData - An object containing two properties: shippingAddressParams and countryParams.
     */
    fillShippingData(addressData: { shippingAddressParams: { field: string, value: string }[], countryParams: { field: string, value: string }[] }): void {
        cy.log('Filling Shipping Data');

        const { shippingAddressParams, countryParams } = addressData;

        shippingAddressParams.forEach(({ field, value }) => {
            this.fillField(field, value);
        });

        countryParams.forEach(({ field, value }) => {
            this.selectValue(field, value);
        });
    }
}

export const forms = new Forms();