/// <reference types="cypress"/>

import { CART_SELECTORS } from "../selectors/cartSelectors";
import { CHECKOUT_SELECTORS } from "../selectors/checkoutSelectors";
import { cart } from "./cart";
import { forms } from "./forms";
import { product } from "./product";
import { results } from "./results";
import { routes } from "./routes";
import { widgets } from "./widgets";


const SAVE_NEW_ADDRESS_MESSAGE = "You saved the address.";
const THANK_YOU_PAGE_TITLE = 'Thank you for your purchase!';
const THANK_YOU_PAGE_MESSAGE = 'We\'ll email you an order confirmation with details and tracking info';
const THANK_YOU_MULTI_MESSAGE = 'For successfully order items, you\'ll receive a confirmation email including order numbers, tracking information and more details.';

const regularShippingElements = {
    checkoutShippingElements: [
        { name: 'Progress Bar', selector: CHECKOUT_SELECTORS.progressBar },
        { name: 'Shipping Address', selector: CHECKOUT_SELECTORS.shippingAddressSection },
        { name: 'Shipping Methods', selector: CHECKOUT_SELECTORS.shippingMethodSection },
        { name: 'Order Summary', selector: CHECKOUT_SELECTORS.summarySidebarSection }
    ],
    checkoutRPElements: [
        { name: 'Progress Bar', selector: CHECKOUT_SELECTORS.progressBar },
        { name: 'Payment Method', selector: CHECKOUT_SELECTORS.paymentMethodsSection },
        { name: 'Discount Section', selector: CHECKOUT_SELECTORS.discountSection },
        { name: 'Order Summary', selector: CHECKOUT_SELECTORS.summarySidebarSection },
        { name: 'Shipping Information', selector: CHECKOUT_SELECTORS.shippingInfoSection }
    ],
    orderItemElements: [
        { name: 'title', selector: CHECKOUT_SELECTORS.productTitle },
        { name: 'qty', selector: CHECKOUT_SELECTORS.productQty },
        { name: 'price', selector: CHECKOUT_SELECTORS.productPrice },
        { name: 'options', selector: CHECKOUT_SELECTORS.productOptions },
        { name: 'photo', selector: CHECKOUT_SELECTORS.productImage }
    ]
};

const multiShippingCheckoutElements = {
    shipMultipleElements: [
        { name: 'Table', selector: CHECKOUT_SELECTORS.multiShippingTable },
        { name: 'Go to Shipping Information', selector: CHECKOUT_SELECTORS.continueButton },
        { name: 'Back to Shopping Cart', selector: CHECKOUT_SELECTORS.backButton },
        { name: 'Update Qty & Addresses', selector: CART_SELECTORS.updateActionButton },
        { name: 'Enter a New Address', selector: CHECKOUT_SELECTORS.addItemButton }
    ],
    shippingMethodPageElements: [
        { name: 'Shipping Information', selector: CHECKOUT_SELECTORS.shippingBlock },
        { name: 'Shipping To', selector: CHECKOUT_SELECTORS.shippingToSection },
        { name: 'Items', selector: CHECKOUT_SELECTORS.cartItemsSection },
        { name: 'Go to Billing Information', selector: CHECKOUT_SELECTORS.continueButton },
        { name: 'Back to Select Addresses', selector: CHECKOUT_SELECTORS.backButton }
    ],
    billingInformationPageElements: [
        { name: 'Billing Information', selector: CHECKOUT_SELECTORS.billingBlock },
        { name: 'Payment Method', selector: CHECKOUT_SELECTORS.paymentBox },
        { name: 'Go to Review Your Order', selector: CHECKOUT_SELECTORS.continueButton },
        { name: 'Back to Shipping Information', selector: CHECKOUT_SELECTORS.backButton }
    ],
    reviewOrderPageElements: [
        { name: 'Billing Information', selector: CHECKOUT_SELECTORS.billingBlock },
        { name: 'Shipping Information', selector: CHECKOUT_SELECTORS.paymentBox },
        { name: 'Items', selector: CHECKOUT_SELECTORS.orderReviewTable },
        { name: 'Back to Shipping Information', selector: CHECKOUT_SELECTORS.backButton },
        { name: 'Place Order', selector: CHECKOUT_SELECTORS.placeOrderMultiShippingButton },
        { name: 'Back to Billing Information', selector: CHECKOUT_SELECTORS.backButton }
    ]
};

const multipleAddressTableElements = ['Product', 'Qty', 'Send To', 'Actions'];

const billingSelectors = [
    CHECKOUT_SELECTORS.billingSameAsShippingSection,
    CHECKOUT_SELECTORS.billingAddressDetailsSection
];

const newAddressParams = {
    shippingAddressParams: [
        { field: CHECKOUT_SELECTORS.newStreetAddressField, value: Cypress.env("SHIPPING_ADDRESS") },
        { field: CHECKOUT_SELECTORS.cityField, value: Cypress.env("CITY") },
        { field: CHECKOUT_SELECTORS.zipPostalCodeField, value: '12345-6789' },
        { field: CHECKOUT_SELECTORS.phoneNumberField, value: Cypress.env("PHONE_NUMBER") }
    ],
    countryParams: [
        { field: CHECKOUT_SELECTORS.countrySelect, value: "United States" },
        { field: CHECKOUT_SELECTORS.stateProvinceSelect, value: "Alaska" }
    ]
};


class Checkout {

    /**
     * Clicks a button with specific text within a given selector.
     * Used for common 'Change' or 'Edit' button actions.
     * @param selector - The CSS selector to find the button.
     * @param buttonText - The text content of the button to click.
     */
    private clickActionLink(selector: string, buttonText: string): void {
        cy.log(`Clicking action button with text: "${buttonText}" and selector: "${selector}".`);

        cy.get(selector)
            .contains(buttonText)
            .should('be.visible')
            .click();
    }

    /**
     * Verifies visibility and non-empty content of UI elements defined in a map.
     * Optionally expands item sections (e.g., order summary) if specified.
     * @param type - The key indicating which set of elements to verify.
     * @param map - A mapping of types to arrays of element metadata (name + selector).
     * @param expandItems - Whether to expand additional UI (e.g., order items) before verifying elements.
     */
    private verifySectionElements(type: string, map: Record<string, { name: string; selector: string }[]>, expandItems = false): void {
        cy.log(`Verifying ${type} Elements`);

        const elements = map[type];
        if (!elements) {
            throw new Error(`Unsupported section element type: ${type}`);
        }

        if (expandItems) {
            this.expandItemsSection();
        }

        elements.forEach(({ name, selector }) => {
            cy.log(`Checking visibility of ${name}`);

            cy.get(selector).should('be.visible').and('not.be.empty');
        });
    }

    /**
     * Verifies the visibility and non-emptiness of checkout elements based on the provided type.
     * @param {('Shipping' | 'Payments' | 'Order Item')} type - The type of checkout elements to verify.
     */
    verifyCheckoutElements(type: 'Shipping' | 'Payments' | 'Order Item'): void {
        cy.log(`Verifying ${type} Elements`);

        const elementMap: Record<'Shipping' | 'Payments' | 'Order Item', { name: string; selector: string }[]> = {
            'Shipping': regularShippingElements.checkoutShippingElements,
            'Payments': regularShippingElements.checkoutRPElements,
            'Order Item': regularShippingElements.orderItemElements
        };

        const expand = type !== 'Payments';
        this.verifySectionElements(type, elementMap, expand);
    }

    /**
     * Verifies the visibility of UI elements for the specified section of the multiple addresses checkout process.
     * @param type - The section of the checkout to verify ('Addresses', 'Shipping', 'Payments', or 'Review').
     */
    verifyMultipleAddressesCheckoutElements(type: 'Addresses' | 'Shipping' | 'Payments' | 'Review'): void {
        cy.log(`Verifying ${type} Elements`);

        const elementMap: Record<'Addresses' | 'Shipping' | 'Payments' | 'Review', { name: string; selector: string }[]> = {
            'Addresses': multiShippingCheckoutElements.shipMultipleElements,
            'Shipping': multiShippingCheckoutElements.shippingMethodPageElements,
            'Payments': multiShippingCheckoutElements.billingInformationPageElements,
            'Review': multiShippingCheckoutElements.reviewOrderPageElements
        };

        this.verifySectionElements(type, elementMap);
    }

    /**
     * Verifies the presence and visibility of key columns in the multiple addresses table during checkout.
     */
    verifyMultipleAddressesTable(): void {
        cy.log('Verifying Multiple Addresses Table');

        cy.get(CHECKOUT_SELECTORS.multiShippingTable).within(() => {
            multipleAddressTableElements.forEach((column) => {
                cy.log(`Verifying ${column} column`);

                cy.get(`[data-th="${column}"]`).should('be.visible');
            });
        });
    }

    /**
     * Verifies if the specified checkout progress section is active.
     * @param {string} activeSection - The name of the active checkout progress section.
     */
    shouldShowProgress(activeSection: string): void {
        cy.log(`Verifying if ${activeSection} is active`);

        cy.get(CHECKOUT_SELECTORS.progressBar)
            .find(CHECKOUT_SELECTORS.progressBarStepItem)
            .should('contain', activeSection)
            .and('have.class', '_active');
    }

    /**
     * Expands the collapsible order items section in the order summary (if not already expanded).
     */
    expandItemsSection(): void {
        cy.log('Expanding Items in Cart Section');

        cy.get(CHECKOUT_SELECTORS.summarySidebarSection).within(() => {
            cy.get(CHECKOUT_SELECTORS.itemsInCartSection)
                .click()
                .should('have.class', 'active');
        });
    }

    /** 
     * Clicks a button that matches the given selector and text.
     * @param {string} selector - The CSS selector of the button container.
     * @param {string} text - The visible text on the button.
    */
    shouldClickOnButton(selector: string, text: any): void {
        cy.log(`Clicking on a button with text: ${text}`);

        cy.get(selector)
            .contains(text)
            .should('be.visible')
            .and('not.be.disabled')
            .click();
    }

    /**
     * Clicks the 'Continue Button' to proceed to the next section in the checkout flow.
     */
    goToNextSection(type: 'Addresses' | 'Shipping' | 'Add New Address', retries: number = 0): void {
        let button: string;
        let route: string;
        let currentUrl: string;
        let selector: string;

        const maxRetries = 10;

        switch (type) {
            case 'Addresses':
                button = 'Go to Shipping Information';
                route = 'MultiShippingMethodPage';
                selector = CHECKOUT_SELECTORS.continueButton;
                currentUrl = '/multishipping/checkout/addresses/';
                break;

            case 'Shipping':
                button = 'Go to Billing Information';
                route = 'MultiShippingBillingPage';
                selector = CHECKOUT_SELECTORS.continueButton;
                currentUrl = '/multishipping/checkout/shipping/';
                break;

            case 'Add New Address':
                button = 'Enter a New Address';
                route = 'MultiShipNewAddressPage';
                selector = CHECKOUT_SELECTORS.addItemButton;
                currentUrl = '/multishipping/checkout/addresses/';
                break;

            default:
                throw Error(`Unknown section type: ${type}`);
        }

        cy.log(`Attempting clicking on ${button} button`);

        routes.expect(route);
        cy.get(selector)
            .click();

        cy.wait(5000);

        cy.url().then((url) => {
            if (url.includes(currentUrl) && retries < maxRetries) {
                cy.log(`Still on address list — clicking again - Retry ${retries}`);

                this.goToNextSection(type, retries + 1);
            } else {
                cy.log('Redirected to new page successfully');
            }
        });
    }

    /**
     * Verifies that the shipping address and method sections are properly selected.
     */
    shouldVerifyShippingSection(): void {
        cy.log('Verifying selected Shipping Address and Method');

        cy.get(CHECKOUT_SELECTORS.shippingAddressItem)
            .should('exist')
            .and('have.class', 'selected-item');

        cy.get(CHECKOUT_SELECTORS.shippingMethodTable)
            .find(CHECKOUT_SELECTORS.shippingMethodRadio)
            .should('have.attr', 'checked');
    }

    /**
     * Verifies that the billing section is visible and contains address details.
     */
    shouldVerifyBillingSection(): void {
        cy.log('Verifying selected Billing Address');

        billingSelectors.forEach(selector => {
            cy.get(selector).should('be.visible');
        });
    }

    /**
     * Selects a shipping method option by index (0-based).
     * @param {number} index - Index of the shipping method to select.
     */
    shouldCheckShippingMethod(index: number): void {
        cy.log(`Checking Shipping Method with index ${index}`);

        cy.get(CHECKOUT_SELECTORS.shippingMethodTable)
            .find(CHECKOUT_SELECTORS.shippingMethodRadio)
            .eq(index)
            .click();
    }
    /**
     * Expands the 'Send To Address' dropdown.
     */
    expandSentToAddress(): void {
        cy.log('Expanding "Send To Address" dropdown.');

        cy.get(CHECKOUT_SELECTORS.sendToListControl)
            .first()
            .click();
    }

    /**
     * Clicks the 'New Address' button and verifies modal visibility
     */
    shouldModalAppear(): void {
        cy.log('Verifying modal visibility');

        this.shouldClickOnButton(CHECKOUT_SELECTORS.addAddressButton, 'New Address');

        cy.get(CHECKOUT_SELECTORS.modalAddressWrap).should('be.visible');
    }

    /**
     * Clicks the 'Save Address' button, typically after entering new address details in a form.
     */
    saveNewAddress(): void {
        cy.log('Attempting to save new address.');

        cy.get(CHECKOUT_SELECTORS.saveButton)
            .should('contain', 'Save Address')
            .click();
    }

    /**
     * Retrieves the list of address options from either the Shipping or Billing address dropdown.
     * @param {('Shipping' | 'Billing')} type - The type of address dropdown to target.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>} A chainable containing the option elements.
     */
    getOptionList(type: 'Shipping' | 'Billing'): Cypress.Chainable<JQuery<HTMLElement>> {
        const dropdownSelectorMap = {
            Shipping: CHECKOUT_SELECTORS.selectShippingAddressDropdown,
            Billing: CHECKOUT_SELECTORS.selectBillingAddressDropdown,
        };

        const selector = dropdownSelectorMap[type];

        cy.log(`Retrieving address options from the ${type} address dropdown.`);

        return cy.get(selector).first().find(CHECKOUT_SELECTORS.optionElements);
    }

    /**
     * Gets the product items displayed in a table, typically in a cart or review page.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>} A Cypress chainable representing the product item rows.
     */
    getProducts(): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('Getting product items from the table.');

        return cy.get(CHECKOUT_SELECTORS.productItemsInTable);
    }

    /**
     * Gets the addresses displayed in a block.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>} A Cypress chainable representing the address item.
     */
    getAddresses(): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('Getting address items from the table');
    
        return cy.get(CHECKOUT_SELECTORS.shippingAddressItem);
    }

    /**
     * Selects an address from a dropdown by its 0-based index.
     * @param {number} index - The index of the address to select in the dropdown.
     */
    selectAddress(type: 'Shipping' | 'Billing', index: number): void {
        cy.log(`Selecting address at index: ${index}.`);

        const dropdownSelectorMap = {
            Shipping: CHECKOUT_SELECTORS.selectShippingAddressDropdown,
            Billing: CHECKOUT_SELECTORS.selectBillingAddressDropdown,
        };

        const selector = dropdownSelectorMap[type];

        cy.get(selector)
            .first()
            .select(index);
    }

    /**
     * Removes an item from the table by clicking its remove button based on index.
     * Waits for the 'MultiShippingPage' route to ensure the page reloads after removal.
     * @param {number} index - The 0-based index of the item to remove.
     */
    removeItem(index: number): void {
        cy.log(`Attempting to remove item at index: ${index}.`);

        routes.expect('MultiShippingPage');
        cy.get(CHECKOUT_SELECTORS.removeItemButton)
            .eq(index)
            .click();
        cy.wait('@MultiShippingPage');
    }

    /**
     * Clicks the 'Change' button related to shipping address on a review/summary page.
     */
    changeAddress(): void {
        cy.log('Attempting to change shipping address.');

        cy.get(CHECKOUT_SELECTORS.shippingToSection).within(() => {
            this.clickActionLink(CHECKOUT_SELECTORS.editItemButton, 'Change');
        });
    }

    /**
     * Clicks the "Update" button in the address section and verifies that the "Edit" button becomes visible.
     */
    updateAddressAndVerify(): void {
        cy.log('Clicking the "Update" button and verifying that the address can be edited.');

        cy.get(CHECKOUT_SELECTORS.updateItem).click();
        cy.get(CHECKOUT_SELECTORS.editAddressButton)
            .should('be.visible')
            .and('contain', 'Edit');
    }

    /**
     * Clicks the 'Change' button related to billing address on a review/summary page.
     */
    changeBilling(): void {
        cy.log('Attempting to change billing address.');

        this.clickActionLink(CHECKOUT_SELECTORS.actionGenericButton, 'Change');
    }

    /**
     * Clicks the 'Edit' button for items on a review/summary page.
     */
    editItems(): void {
        cy.log('Attempting to edit items.');

        this.clickActionLink(CHECKOUT_SELECTORS.editItemButton, 'Edit');
    }

    /**
     * Updates the quantity of a product in the multi-shipping table by its input field's index.
     * @param {number} qtyToChange - The new quantity value to enter.
     */
    updateQty(qtyToChange: number): void {
        cy.log(`Updating quantity to: ${qtyToChange}.`);

        cy.get(CHECKOUT_SELECTORS.qtyFieldMultiShipping)
            .eq(1)
            .find(CHECKOUT_SELECTORS.inputQtyField)
            .clear()
            .type(qtyToChange.toString());
    }

    /**
     * Verifies that the addresses block contains addresses to choose from (i.e., not empty).
     */
    shouldContainAddresses(): void {
        cy.log('Verifying that the addresses block contains selectable addresses.');

        cy.get(CHECKOUT_SELECTORS.addressesBlock)
            .find(CHECKOUT_SELECTORS.addressesToChoose)
            .should('not.be.empty');
    }

    /**
     * Helper function to navigate back by clicking a button and verifying the URL and expected route alias.
     * @param buttonSelector - Selector for the back button.
     * @param buttonText - Text of the back button.
     * @param expectedRouteAlias - Alias for the expected route after navigation.
     * @param expectedUrlPart - Part of the URL to assert.
     */
    shouldNavigateBackToSection(buttonSelector: string, buttonText: string, expectedRouteAlias: string, expectedUrlPart: string): void {
        cy.log(`Navigation back by clicking "${buttonText}" button.`);
        
        routes.expect(expectedRouteAlias);
        this.shouldClickOnButton(buttonSelector, buttonText);

        cy.url().should('contain', expectedUrlPart);
    }

    /**
     * Validates that the Thank You page is displayed with the correct title and confirmation message.
     */
    shouldVerifyThankYouPage(type: 'Checkout' | 'Multicheckout'): void {
        cy.log('Verifying correctness of Thank You Page');

        let successPageSelector: string;
        let thankYouPage: string;

        switch (type) {
            case 'Checkout':
                successPageSelector = CHECKOUT_SELECTORS.successTYPage;
                thankYouPage = THANK_YOU_PAGE_MESSAGE;

                break;

            case 'Multicheckout':
                successPageSelector = CHECKOUT_SELECTORS.multiShippingSuccessTYPage;
                thankYouPage = THANK_YOU_MULTI_MESSAGE;
                break;

            default:
                throw Error(`Unknown checkout type: ${type}`);
        }

        results.shouldVerifyPageTitle(THANK_YOU_PAGE_TITLE);
        results.shouldVerifyTextInSection(successPageSelector, thankYouPage);
    }

    /**
     * Verifies that a select dropdown identified by the given selector contains the expected number of options.
     * @param selector - The CSS selector for the dropdown element.
     * @param numberOfOptions - The expected number of option elements within the dropdown.
     */
    verifyOptions(selector: string, numberOfOptions: number): void {
        cy.log(`Verifying that the dropdown at ${selector} contains ${numberOfOptions} options`);

        cy.get(selector)
            .first()
            .find(CHECKOUT_SELECTORS.optionElements)
            .should('have.length', numberOfOptions);
    }

    /**
     * Clicks on the edit button within the shipping information section based on the provided index.
     * @param index - The index of the edit button to click (0 for "Ship To", 1 for "Shipping Method")
     */
    clickOnEditButtons(index: number): void {
        cy.log(`Clicking on the edit button at index ${index}`);

        cy.get(CHECKOUT_SELECTORS.shippingInfoSection).within(() => {
            cy.get(CHECKOUT_SELECTORS.shippingInfoTitle)
                .find(CART_SELECTORS.editButtonCart)
                .eq(index)
                .click();
        });
    }

    /**
     * Places an order based on the specified checkout type.
     * @param type - Specifies the type of checkout: 'Checkout' for regular checkout or 'Multicheckout' for multi-shipping checkout.
     */
    placeOrder(type: 'Checkout' | 'Multicheckout'): void {
        cy.log(`Placing Order in ${type}`);

        const placeOrderButton = type === 'Checkout'
            ? CHECKOUT_SELECTORS.placeOrderButton
            : CHECKOUT_SELECTORS.submitButton;

        const successRouteKey = type === 'Checkout'
            ? 'SuccessPage'
            : 'SuccessMultiPage';

        routes.expect(successRouteKey);
        checkout.shouldClickOnButton(placeOrderButton, 'Place Order');
        cy.wait(`@${successRouteKey}`);
    }

    /**
     * Completes the order flow for either a regular checkout or multicheckout.
     * @param type - Specifies the type of checkout: 'Checkout' for regular checkout or 'Multicheckout' for the multi-shipping checkout.
     * @param afterThankYouCallback - An optional callback function to execute after verifying the thank you page.
     */
    completeOrderFlow(type: 'Checkout' | 'Multicheckout', afterThankYouCallback?: () => void): void {
        cy.log(`Completing order flow for ${type}`);

        checkout.placeOrder(type);
        checkout.shouldVerifyThankYouPage(type);

        const continueButtonSelector = type === 'Checkout'
            ? CHECKOUT_SELECTORS.continueButton
            : CHECKOUT_SELECTORS.submitButton;

        if (afterThankYouCallback) {
            afterThankYouCallback();
        } else {
            checkout.shouldClickOnButton(continueButtonSelector, 'Continue Shopping');
            cy.expect('LoadPage');
            cy.url().should('contain', '/');
        }
    }

    /**
    * Opens Apply Discount Code section.
    */
   openCouponSection(): void {
       cy.log('Opening Coupon section');

       cy.get(CHECKOUT_SELECTORS.couponBlock)
           .should('have.attr', 'aria-expanded', 'false')
           .click()
           .should('have.attr', 'aria-expanded', 'true');
   }

    /**
     * Applies a coupon code to the cart.
     * @param couponCode The coupon code to apply.
     */
    applyCoupon(couponCode: string): void {
        cy.log(`Applying coupon code - ${couponCode}`);

        cy.get(CHECKOUT_SELECTORS.discountCodeInput)
            .should('be.visible')
            .clear()
            .type(couponCode);

        cy.get(CHECKOUT_SELECTORS.applyCouponButton).click();

        routes.expect('CouponResult');
    }

    /**
     * Cancels Coupon in Apply Discount Code section
     */
    cancelCoupon(): void {
        cy.log('Cancelling coupon');
    
        cy.get(CHECKOUT_SELECTORS.cancelAction)
            .contains('Cancel coupon')
            .click();
    }

    /**
     * Verifies if a specific coupon message is displayed on the page.
     * It waits for a few seconds to ensure the message has time to appear
     * before asserting its content.
     * @param message - The exact text or a part of the text expected in the coupon message.
     */
    shouldVerifyCouponMessage(message: string): void {
        cy.log('Verifying coupon message');

        cy.wait(5000);
        cy.get(CHECKOUT_SELECTORS.validationMessageSection)
        .should(($el) => {
            const text = $el.text();
            expect(text).to.contain(message);
        });
    }

    /**
     * Applies a coupon code and verifies the corresponding message based on whether the coupon is valid or invalid.
     * If the coupon is valid, it also cancels the coupon and verifies the cancellation message.
     * @param {string} couponCode - The coupon code to be applied.
     * @param {string} type - The type of the coupon, either 'Valid' or 'Invalid'.
     */
    applyCouponAndVerify(couponCode: string, type: string) {
        const COUPON_MESSAGE = type === 'Invalid'
            ? 'The coupon code isn\'t valid. Verify the code and try again.'
            : 'Your coupon was successfully applied.';

        const CANCEL_COUPON_MESSAGE = 'Your coupon was successfully removed.';
    
        checkout.openCouponSection();
        checkout.applyCoupon(couponCode);
        checkout.shouldVerifyCouponMessage(COUPON_MESSAGE);
    
        if (type === 'Valid') {
            checkout.cancelCoupon();
            checkout.shouldVerifyCouponMessage(CANCEL_COUPON_MESSAGE);
        }
    }

    /**
     * Fills in the new shipping address form with default test data and saves it.
     * Verifies the confirmation message after saving.
     */
    fillFullShippingAddress(): void {
        cy.log('Filling out full shipping address form.');

        forms.fillShippingData(newAddressParams);
        checkout.saveNewAddress();
        results.shouldVerifyPageMessage(SAVE_NEW_ADDRESS_MESSAGE);
    }

    /**
     * Verifies that the number of items in a specified element has changed by a given amount.
     * @param {string} selector - The CSS selector of the element whose count is being verified.
     * @param {number} initialCount - The original number of items.
     * @param {number} expectedChange - The expected change in item count (positive or negative).
     */
    verifyCountChange(selector: string, initialCount: number, expectedChange: number): void {
        cy.log(`Verifying change in item count from ${initialCount} to ${expectedChange}.`);

        widgets.shouldVerifyNumberOfElements(
            selector,
            initialCount + expectedChange
        );
    }

    /**
     * Adds a default product to the cart if it's empty and navigates to the checkout page.
     */
    addDefaultProductIfNeeded(): void {
        cy.log("Checking if cart is empty and adding default products if needed.");

        cart.isEmpty().then((isEmpty) => {
            if (isEmpty) {
                product.addDefaultProductToCart();
                product.addDefaultEquipmentProductToCart();
            }
        })

        routes.visitAndWait('CheckoutPage');
    }

    /**
     * Executes the step action during the checkout process.
     * It checks whether a button exists and navigates to the appropriate step
     * based on the element type.
     * @param {Object} step - The current checkout step containing information like buttonText, elementType, and expectedRouteAlias.
     */
    performStepAction(step: { pageTitle: any; buttonText: any; elementType: string; expectedRouteAlias: string; }): void {
        cy.log(`Executing step action for: ${step.pageTitle}`);

        if (step.buttonText) {
            if (step.elementType === 'Addresses' || step.elementType === 'Shipping') {
                this.goToNextSection(step.elementType);
            } else {
                routes.expect(step.expectedRouteAlias);
                this.shouldClickOnButton(CHECKOUT_SELECTORS.continueButton, step.buttonText);
            }
        }
    }

    /**
     * Navigates to the multi-shipping checkout page from the cart.
     * It handles visiting the cart and clicking the multi-checkout button, then waits for the destination page.
     */
    redirectToMultiCheckout(): void {
        cy.log("Redirecting to Multi-Shipping Checkout page.");
        
        routes.visitAndWait('CartPage');
        routes.expect('MultiShippingPage');
        this.shouldClickOnButton(CHECKOUT_SELECTORS.multiShippingButton, 'Check Out with Multiple Addresses');
    }
}

export const checkout = new Checkout();