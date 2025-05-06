/// <reference types="cypress"/>

import { PRODUCT_SELECTORS } from "../selectors/selectors";
import { results } from "./results";
import { routes } from "./routes";


let ADD_TO_CART_MESSAGE: string;

const productCells = {
    cloth: [
        { name: 'image', locator: PRODUCT_SELECTORS.productImage },
        { name: 'title', locator: PRODUCT_SELECTORS.productTitle },
        { name: 'price', locator: PRODUCT_SELECTORS.productPrice },
        { name: 'size', locator: PRODUCT_SELECTORS.productSize },
        { name: 'colors', locator: PRODUCT_SELECTORS.productColors },
        { name: 'add to cart', locator: PRODUCT_SELECTORS.addToCart }
    ],
    equipment: [
        { name: 'image', locator: PRODUCT_SELECTORS.productImage },
        { name: 'title', locator: PRODUCT_SELECTORS.productTitle },
        { name: 'reviews', locator: PRODUCT_SELECTORS.productReviews },
        { name: 'price', locator: PRODUCT_SELECTORS.productFinalPrice },
        { name: 'add to cart', locator: PRODUCT_SELECTORS.addToCart }
    ]
};

const actionElements = [
    { name: 'wishlist', locator: PRODUCT_SELECTORS.actionElements.wishlist },
    { name: 'compare', locator: PRODUCT_SELECTORS.actionElements.compare }
];

const pdpElements = [
    { name: 'main elements', locator: PRODUCT_SELECTORS.productInfoMain },
    { name: 'gallery', locator: PRODUCT_SELECTORS.productGallery },
    { name: 'details', locator: PRODUCT_SELECTORS.productDetails }
];

const infoElements = [
    { name: 'Title', locator: PRODUCT_SELECTORS.pageTitle, mustNotBeEmpty: true },
    { name: 'Review', locator: PRODUCT_SELECTORS.productReviews, mustNotBeEmpty: false },
    { name: 'Price', locator: PRODUCT_SELECTORS.productPrice, mustNotBeEmpty: false },
    { name: 'Stock', locator: PRODUCT_SELECTORS.productStock, mustContainText: 'In stock' },
    { name: 'SKU', locator: PRODUCT_SELECTORS.productSku, mustNotBeEmpty: true },
    { name: 'Size', locator: PRODUCT_SELECTORS.productSizeOption, mustNotBeEmpty: false },
    { name: 'Colors', locator: PRODUCT_SELECTORS.productColorOption, mustNotBeEmpty: false },
]


class Product {

    /**
     * Retrieves a product item element based on the page type.
     * For 'PDP', it gets the product options wrapper.
     * For 'Listing Page', it gets the first product item details element.
     * @param type - The type of page ('PDP' or 'Listing Page').
     * @returns A Cypress chainable yielding the relevant product element(s).
     */
    private getItem(type: 'PDP' | 'Listing Page'): Cypress.Chainable<JQuery<HTMLElement>> {
        switch (type) {
            case 'PDP':
                return cy.get(PRODUCT_SELECTORS.productOptionsWrapper);
            case 'Listing Page':
                return cy.get(PRODUCT_SELECTORS.productItemDetails)
                    .eq(1);
            //.first();
        }
    }

    /**
     * Hovers over the first product item on a listing page to reveal hidden action links.
     * Assumes the hover effect is triggered by mouseover and reveals elements within the item.
     * NOTE: This method *always* operates on the first item.
     * @returns A Cypress chainable yielding the hovered first item element (aliased as '@item').
     */
    private hoverItem(): Cypress.Chainable<JQuery<HTMLElement>> {
        return this.getItem('Listing Page')
            .should('be.visible')
            .trigger('mouseover')
            .wait(500)
            .as('item');
    }

    /**
     * Retrieves a specific swatch attribute block (e.g., Size, Color)
     * within the context determined by the page type ('PDP' or 'Listing Page').
     * @param type - The type of page ('PDP' or 'Listing Page') to get the context element.
     * @param attribute - The name or type of the swatch attribute (e.g., 'size', 'color').
     * @returns A Cypress chainable yielding the swatch attribute element.
     */
    private getAttribute(type: 'PDP' | 'Listing Page', attribute: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return this.getItem(type)
            .find(PRODUCT_SELECTORS.swatchAttribute(attribute));
    }

    /**
     * Selects an option (swatch or dropdown) for a specific product attribute
     * within the context determined by the page type ('PDP' or 'Listing Page').
     * @param type - The type of page ('PDP' or 'Listing Page') to get the context element.
     * @param attribute - The name or type of the attribute to select an option for (e.g., 'size', 'color').
     * @param value Optional. The specific value of the option to select. If not provided, selects the second available non-disabled option.
     */
    private selectOption(type: 'PDP' | 'Listing Page', attribute: string, value?: string): void {
        cy.log(`Selecting ${attribute} - ${value}`);

        this.getAttribute(type, attribute).as('attribute');

        if (value) {
            cy.get('@attribute')
                .find(PRODUCT_SELECTORS.swatchOptionByLabel(value))
                .should('exist')
                .and('not.have.class', 'disabled')
                .click();
        } else {
            cy.get('@attribute')
                .find(PRODUCT_SELECTORS.swatchOption)
                .not('.disabled')
                .should('have.length.gte', 1).then(($options) => {
                    const indexToClick = $options.length === 1 ? 0 : 1;

                    cy.wrap($options)
                        .eq(indexToClick)
                        .click();
                })
        }
    }

    /**
     * Retrieves the product name of the first product item on a listing page.
     * NOTE: This method *always* gets the name of the first item.
     * @returns A Cypress chainable yielding the text content of the product name.
     */
    getProductName(): Cypress.Chainable<string> {
        return this.getItem('Listing Page')
            .should('be.visible')
            .find(PRODUCT_SELECTORS.productTitle + ' a')
            .invoke('text');
    }

    /**
     * Retrieves the product price element of the first product item on a listing page.
     * NOTE: This method *always* gets the price of the first item.
     * @returns A Cypress chainable yielding the product price element.
     */
    getPrice(): Cypress.Chainable<JQuery<HTMLElement>> {
        return this.getItem('Listing Page')
            .find(PRODUCT_SELECTORS.productPrice);
    }

    /**
     * Retrieves the related products block.
     * @returns A Cypress chainable yielding the product item elements within the related products block.
     */
    getRelated(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(PRODUCT_SELECTORS.relatedProductsWrapper)
            .find(PRODUCT_SELECTORS.productItemDetails);
    }

    /**
     * Clicks on a specific tab (e.g., Description, Details, Reviews, More Information)
     * within the product details section on a PDP.
     * @param name The text content of the tab to click.
     * @returns A Cypress chainable yielding the clicked tab element.
     */
    getTab(name: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(PRODUCT_SELECTORS.productDetails).within(() => {
            cy.contains(name)
                .click();
        });
    }

    /**
     * Verifies the visibility of core elements expected within a product listing item cell.
     * Uses a predefined list of selectors based on product type (cloth or equipment).
     * @param isEquipment Boolean indicating if verifying an equipment product cell (affects which selectors are used).
     */
    shouldVerifyProductCellElements(isEquipment: boolean): void {
        const cells = isEquipment ? productCells.equipment : productCells.cloth;

        cells.forEach(({ name, locator }) => {
            cy.log(`Verifying Product Info Element: ${name}`);
            cy.get(locator)
                .should('be.visible');
        });
    }

    /**
     * Verifies key product information displayed in the main info block on a PDP.
     * Uses a predefined list of verifications including visibility, text content, and length checks.
     */
    shouldDisplayProductInfo(): void {
        infoElements.forEach(({ name, locator, mustNotBeEmpty, mustContainText }) => {
            cy.log(`Verifying Display Info of an Element: ${name}`);

            cy.get(PRODUCT_SELECTORS.productInfoMain)
                .find(locator)
                .should('be.visible')
                .then(($el) => {
                    if (mustNotBeEmpty) {
                        expect($el.text().trim().length).to.be.greaterThan(0);
                    }
                    if (mustContainText) {
                        expect($el.text()).to.include(mustContainText);
                    }
                });
        });
    }

    /**
     * Verifies that the action elements (Wishlist, Compare) are visible on a product item after hovering.
     * Requires hovering over the product item to reveal the links.
     */
    shouldVerifyActionElements(): void {
        this.hoverItem();

        actionElements.forEach(({ name, locator }) => {
            cy.log(`Verifying hidden action: ${name}`);

            cy.get('@item')
                .find(PRODUCT_SELECTORS.actionsSecondary)
                .find(locator)
                .first()
                .should('exist');
        });
    }

    /**
     * Verifies the visibility of main sections/blocks on a Product Detail Page (PDP).
     * Uses a predefined list of selectors for main PDP elements.
     */
    shouldVerifyMainPDPElements(): void {
        for (const pdpElement of pdpElements) {
            cy.log(`Verifying visibility of ${pdpElement.name}`)

            cy.get(pdpElement.locator)
                .should('be.visible');
        }
    }

    /**
     * Clicks through a list of tabs within the product details section on a PDP
     * and verifies that the content panel associated with each clicked tab becomes visible.
     * @param tabs An array of objects with 'name' (tab text) and 'locator' (selector for the tab's content panel).
     */
    shouldVerifyTabSwitching(tabs: { name: string; locator: string; }[]): void {
        tabs.forEach(({ name, locator }) => {
            cy.log(`Switching to Tab: ${name}`);

            this.getTab(name);
            cy.get(locator)
                .should('be.visible');
        });
    }

    /**
     * Verifies the presence and visibility of specific sections within the "More Information" tab content.
     * Requires clicking the "More Information" tab first.
     */
    shouldVerifyMoreInformationSections(): void {
        const expectedSections = ['Style', 'Material', 'Pattern', 'Climate'];

        this.getTab('More Information');
        expectedSections.forEach(section => {
            cy.log(`Verifying section: ${section}`);

            cy.get(PRODUCT_SELECTORS.additionalInfoSection)
                .contains('th', section)
                .should('be.visible');
        });
    }

    /**
     * Verifies that the description text content within the "Details" tab is not empty.
     * Requires clicking the "Details" tab first.
     */
    shouldDisplayDetailsSectionText(): void {
        cy.log('Verifying Description Text in Details Tab');

        this.getTab('Details');
        cy.get(PRODUCT_SELECTORS.descriptionText)
            .should('not.be.empty')
            .and($el => {
                expect($el.text().trim().length).to.be.greaterThan(10);
            });
    }

    /**
     * Selects an option for the 'Size' attribute based on the page type.
     * Delegates the selection logic to selectOption.
     * @param type - The type of page ('PDP' or 'Listing Page').
     * @param value Optional. The specific size value to select. If not provided, selects the second available option.
     */
    selectSize(type: 'PDP' | 'Listing Page', value?: string): void {
        cy.log(`Selecting ${value}`);

        this.selectOption(type, 'size', value);
    }

    /**
     * Selects an option for the 'Color' attribute based on the page type.
     * Delegates the selection logic to selectOption.
     * @param type - The type of page ('PDP' or 'Listing Page').
     * @param value Optional. The specific color value to select. If not provided, selects the second available option.
     */
    selectColor(type: 'PDP' | 'Listing Page', value?: string): void {
        cy.log(`Selecting ${value}`);

        this.selectOption(type, 'color', value);
    }

    /**
     * Adds the product to the cart based on the page type ('PDP' or 'Listing Page').
     * Selects size and color options if `areOptionsSelected` is false.
     * For 'Listing Page', it hovers over the first item before clicking add to cart.
     * NOTE: For 'Listing Page', this method *always* operates on the first item due to hoverItem.
     * @param type - The type of page ('PDP' or 'Listing Page').
     * @param areOptionsSelected Optional. Boolean indicating if options (size/color) have already been selected. Defaults to false.
     */
    addToCart(type: 'PDP' | 'Listing Page', areOptionsSelected: boolean = false): void {
        cy.log(`Adding to Cart from ${type}`);

        switch (type) {
            case 'PDP':
                if (!areOptionsSelected) {
                    this.selectSize(type);
                    this.selectColor(type);
                }

                cy.get(PRODUCT_SELECTORS.addToCartButtonPDP)
                    .should('be.visible')
                    .click();
                break;

            case 'Listing Page':
                if (!areOptionsSelected) {
                    this.selectSize(type);
                    this.selectColor(type);
                }

                this.hoverItem();
                cy.get('@item')
                    .find(PRODUCT_SELECTORS.addToCart)
                    .click({ force: true });
                break;

            default:
                throw Error(`Unknown page type: ${type}`);
        }
    }

    /**
     * Adds the first product item on a listing page to the Wishlist or Comparison list.
     * Assumes this is done from a listing page and requires hovering to reveal the links.
     * NOTE: This method *always* operates on the first item due to hoverItem.
     * @param type - The action type ('Wishlist' or 'Compare').
     */
    addToWishlistOrCompare(type: 'Wishlist' | 'Compare'): void {
        cy.log(`Adding Product to ${type}`);

        this.hoverItem();
        cy.get('@item')
            .find(PRODUCT_SELECTORS.actionButton(type.toLowerCase() as "wishlist" | "compare"))
            .click({ force: true });
    }

    /**
     * Retrieves the product comparison table element on the compare page.
     * @returns A Cypress chainable yielding the product comparison table element.
     */
    getCompareTable(): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('Getting Compare Table');

        return cy.get(PRODUCT_SELECTORS.productComparisonTable)
            .should('be.visible');
    }

    /**
     * Navigates to the product comparison page by clicking the comparison link.
     * Expects the 'CompareProductsPage' route to be triggered upon navigation.
     */
    compareProducts(): void {
        cy.log('Comparing Products');

        cy.get(PRODUCT_SELECTORS.compareLink)
            .click();

        routes.expect('CompareProductsPage');
        cy.url()
            .should('contain', '/catalog/product_compare/');
    }

    /**
     * Navigates to the listing page, retrieves the name of the first product,
     * adds it to the cart, and verifies the success message.
     */
    addDefaultProductToCart() {
        cy.log('Adding default Product to Cart');

        routes.visitAndWait('ListingPage');

        this.getProductName().then(name => {
            const productName = name.trim();

            ADD_TO_CART_MESSAGE = `You added ${productName} to your shopping cart.`;

            this.addToCart('Listing Page');
            results.shouldVerifyPageMessage(ADD_TO_CART_MESSAGE);
        })
    }

    /**
     * Navigates to the equipment listing page, retrieves the name of the first product,
     * adds it to the cart, and verifies the success message.
     */
    addDefaultEquipmentProductToCart() {
        cy.log('Adding default Equipment Product to Cart');

        routes.visitAndWait('WaterBottlePDP');

        product.addToCart('PDP', true);

        ADD_TO_CART_MESSAGE = 'You added Affirm Water Bottle  to your shopping cart.';
        results.shouldVerifyPageMessage(ADD_TO_CART_MESSAGE);

        routes.visitAndWait('CartPage');
    }

    /**
     * Attempts to add a product to either the Wishlist or Comparison list and verifies the success message.
     * Includes retry logic for handling 'Invalid Form Key' errors.
     * @param {('Wishlist' | 'Compare')} type - The type of action to perform ('Wishlist' or 'Compare').
     * @param {string} expectedMessage - The expected success message after adding the product.
     */
    attemptAddToWishlistOrCompare(type: 'Wishlist' | 'Compare', expectedMessage: string): void {
        cy.log(`Attempting adding to ${type}`);

        const INVALID_KEY_MESSAGE = 'Invalid Form Key. Please refresh the page.';

        let retries = 0;
        const maxRetries = 2;

        routes.expect(`AddTo${type}Result`);
        this.addToWishlistOrCompare(type);
        cy.wait(`@AddTo${type}Result`);

        results.getPageMessage().then(message => {
            if (message.includes(INVALID_KEY_MESSAGE) && retries < maxRetries) {
                cy.log(`Page message contains "${INVALID_KEY_MESSAGE}". Retrying (${retries + 1}/${maxRetries})...`);
                retries++;

                this.attemptAddToWishlistOrCompare(type, expectedMessage);
            } else {
                results.shouldVerifyPageMessage(expectedMessage);

                if (type === 'Wishlist') {
                    cy.url()
                        .should('contain', '/customer/account/login/');
                }
            }
        });
    }
}

export const product = new Product(); 