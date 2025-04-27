/// <reference types="cypress"/>

const productCells = {
    cloth: [
        { name: 'image', locator: '.product-image-photo' },
        { name: 'title', locator: '.product-item-name' },
        { name: 'reviews', locator: '.rating-result' },
        { name: 'price', locator: '.normal-price' },
        { name: 'size', locator: '.swatch-attribute.size' },
        { name: 'colors', locator: '.swatch-attribute.color' },
        { name: 'add to cart', locator: '.action.tocart' }
    ],
    equipment: [
        { name: 'image', locator: '.product-image-photo' },
        { name: 'title', locator: '.product-item-name' },
        { name: 'reviews', locator: '.rating-result' },
        { name: 'price', locator: '.price' },
        { name: 'add to cart', locator: '.action.tocart' }
    ]
};

const actionElements = [
    { name: 'wishlist', locator: 'a.action.towishlist' },
    { name: 'compare', locator: 'a.action.tocompare' }
];

const pdpElements = [
    { name: 'main elements', locator: '.product-info-main' },
    { name: 'gallery', locator: '.product.media' },
    { name: 'details', locator: '.product.info.detailed' }
];

const infoElements = [
    { name: 'Title', locator: 'h1.page-title span', mustNotBeEmpty: true },
    { name: 'Review', locator: '.reviews-actions', mustNotBeEmpty: false },
    { name: 'Price', locator: '.price', mustNotBeEmpty: false },
    { name: 'Stock', locator: '.stock', mustContainText: 'In stock' },
    { name: 'SKU', locator: '.product.attribute.sku .value', mustNotBeEmpty: true },
    { name: 'Size', locator: '.swatch-attribute.size .swatch-option', mustNotBeEmpty: false },
    { name: 'Colors', locator: '.swatch-attribute.color .swatch-option', mustNotBeEmpty: false },
]


class Product {
    private getItem() {
        return cy.get('.product-item-details').first();
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
            .find('.product-item-name a')
            .invoke('text');
    }

    getPrice() {
        return this.getItem()
            .find('.price');
    }

    getRelated() {
        return cy.get('.products-related')
            .find('.product-item-info');
    }

    getTab(name: string) {
        return cy.get('.product.info.detailed').within(() => {
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

            cy.get('.product-info-main')
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
            cy.get('#additional').contains('th', section).should('be.visible');
        });
    }

    shouldDisplayDetailsSectionText() {
        cy.log('verifying description text in Details tab');

        this.getTab('Details');
        cy.get('#description')
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
            .find('.action.tocart')
            .click({ force: true });
    }

    addToCartPDP() {
        cy.log('adding to cart on PDP');

        this.selectSize();
        this.selectColor();

        cy.get('#product-addtocart-button')
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

        return cy.get('#product-comparison tr').should('be.visible');
    }

    compareProducts() {
        cy.log('comparing products');

        cy.get('.actions-toolbar')
            .find('a.action.compare')
            .click();

        cy.url().should('contain', '/catalog/product_compare/');
    }
}

export const product = new Product(); 