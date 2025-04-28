/// <reference types="cypress"/>

import { PRODUCT_SELECTORS } from "../selectors/selectors";


const productCells = {
    cloth: [
        { name: 'image', locator: PRODUCT_SELECTORS.productImage },
        { name: 'title', locator: PRODUCT_SELECTORS.productTitle },
        { name: 'reviews', locator: PRODUCT_SELECTORS.productReviews },
        { name: 'price', locator: PRODUCT_SELECTORS.productPrice },
        { name: 'size', locator: PRODUCT_SELECTORS.productSize },
        { name: 'colors', locator: PRODUCT_SELECTORS.productColors },
        { name: 'add to cart', locator: PRODUCT_SELECTORS.addToCart }
    ],
    equipment: [
        { name: 'image', locator: PRODUCT_SELECTORS.productImage },
        { name: 'title', locator: PRODUCT_SELECTORS.productTitle },
        { name: 'reviews', locator: PRODUCT_SELECTORS.productReviews },
        { name: 'price', locator: PRODUCT_SELECTORS.productPrice },
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

    private getItem() {
        return cy.get(PRODUCT_SELECTORS.productItemDetails).first();
    }

    private hoverItem() {
        return this.getItem()
            .should('be.visible')
            .trigger('mouseover')
            .wait(500)
            .as('item');
    }

    private getAttribute(attribute: string) {
        return this.getItem()
            .find(`.swatch-attribute.${attribute}`);
    }

    private selectOption(attribute: string, value?: string) {
        cy.log(`selecting ${attribute}`);

        this.getAttribute(attribute).as('attribute');

        if (value) {
            cy.get('@attribute')
                .find('[role="option"]')
                .contains(value)
                .click();
        } else {
            cy.get('@attribute')
                .find('.swatch-option')
                .not('.disabled')
                .eq(1)
                .click();
        }
    }

    getProductName() {
        return this.getItem()
            .should('be.visible')
            .find(PRODUCT_SELECTORS.productTitle + ' a')
            .invoke('text');
    }

    getPrice() {
        return this.getItem()
            .find(PRODUCT_SELECTORS.productPrice);
    }

    getRelated() {
        return cy.get('.products-related')
            .find('.product-item-info');
    }

    getTab(name: string) {
        return cy.get(PRODUCT_SELECTORS.productDetails).within(() => {
            cy.contains(name).click();
        });
    }

    shouldVerifyProductCellElements(isEquipment: boolean) {
        const cells = isEquipment ? productCells.equipment : productCells.cloth;

        cells.forEach(({ name, locator }) => {

            cy.log(`verifying product info element: ${name}`);
            cy.get(locator).should('be.visible');
        });
    }

    shouldDisplayProductInfo() {
        infoElements.forEach(({ name, locator, mustNotBeEmpty, mustContainText }) => {
            cy.log(`verifying element - ${name}`);

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

    shouldVerifyActionElements() {
        this.hoverItem();

        actionElements.forEach(({ name, locator }) => {
            cy.log(`verifying hidden action: ${name}`);

            cy.get('@item')
                .find('.actions-secondary')
                .find(locator)
                .first()
                .should('exist');
        });
    }

    shouldVerifyMainPDPElements() {
        for (const pdpElement of pdpElements) {
            cy.log(`verifying visibility of ${pdpElement.name}`)

            cy.get(pdpElement.locator)
                .should('be.visible');
        }
    }

    shouldVerifyTabSwitching(tabs: { name: string; locator: string; }[]) {
        tabs.forEach(({ name, locator }) => {

            cy.log(`switching to tab: ${name}`);
            this.getTab(name);
            cy.get(locator).should('be.visible');
        });
    }

    shouldVerifyMoreInformationSections() {
        const expectedSections = ['Style', 'Material', 'Pattern', 'Climate'];

        this.getTab('More Information');
        expectedSections.forEach(section => {

            cy.log(`verifying section: ${section}`);
            cy.get(PRODUCT_SELECTORS.additionalInfoSection).contains('th', section).should('be.visible');
        });
    }

    shouldDisplayDetailsSectionText() {
        cy.log('verifying description text in Details tab');

        this.getTab('Details');
        cy.get(PRODUCT_SELECTORS.descriptionText)
            .should('not.be.empty')
            .and($el => {

                expect($el.text().trim().length).to.be.greaterThan(10);
            });
    }

    selectSize(value?: string) {
        cy.log(`selecting ${value}`);

        this.selectOption('size', value);
    }

    selectColor(value?: string) {
        cy.log(`selecting ${value}`);

        this.selectOption('color', value);
    }

    addToCart(isEquipment: boolean) {
        cy.log('adding product to cart');

        if (!isEquipment) {
            this.selectSize();
            this.selectColor();
        }

        this.hoverItem();
        cy.get('@item')
            .find(PRODUCT_SELECTORS.addToCart)
            .click({ force: true });
    }

    addToCartPDP() {
        cy.log('adding to cart on PDP');

        this.selectSize();
        this.selectColor();

        cy.get(PRODUCT_SELECTORS.addToCartButtonPDP)
            .should('be.visible')
            .click();
    }

    addToWishlistOrCompare(type: 'wishlist' | 'compare') {
        cy.log(`adding product to ${type}`);

        this.hoverItem();

        cy.get('@item')
            .find('[data-role="add-to-links"]')
            .find(`a.action.to${type}`)
            .first()
            .click({ force: true });
    }

    getCompareTable() {
        cy.log('getting compare table');

        return cy.get(PRODUCT_SELECTORS.productComparisonTable).should('be.visible');
    }

    compareProducts() {
        cy.log('comparing products');

        cy.get(PRODUCT_SELECTORS.compareLink)
            .click();

        cy.url().should('contain', '/catalog/product_compare/');
    }
}

export const product = new Product(); 