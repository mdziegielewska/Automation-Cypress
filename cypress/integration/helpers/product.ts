/// <reference types="cypress"/>

const productClothCell = [
    { name: 'image', locator: '.product-image-photo' },
    { name: 'title',  locator: '.product-item-name' },
    { name: 'reviews', locator: '.rating-result' },
    { name: 'price',  locator: '.normal-price' },
    { name: 'size',  locator: '.swatch-attribute.size' },
    { name: 'colors',  locator: '.swatch-attribute.color' },
    { name: 'add to cart',  locator: '.action.tocart' }
]; 

const productEquipmentCell = [
    { name: 'image', locator: '.product-image-photo' },
    { name: '.title',  locator: '.product-item-name' },
    { name: 'reviews', locator: '.rating-result' },
    { name: 'price',  locator: '.price' },
    { name: 'add to cart',  locator: '.action.tocart' }
]; 

const actionElements = [
    { name: 'wishlist',  locator: 'a.action.towishlist' },
    { name: 'compare',  locator: 'a.action.tocompare' }
]; 


class Product {
    private getItem() {
        return cy.get('.product-item-details').first();
    }

    private getAttribute(attribute: string) {
        return this.getItem()
            .find(`.swatch-attribute.${attribute}`);
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

    shouldVerifyProductCellElements(isEquipment: boolean) {
        if (isEquipment) {
            for(const productInfo of productEquipmentCell) {
                cy.log(`verifying product info elements - ${productInfo.name}`);
    
                cy.get(productInfo.locator)
                    .should('be.visible');
            };
        } else {
            for(const productInfo of productClothCell) {
                cy.log(`verifying product info elements - ${productInfo.name}`);
    
                cy.get(productInfo.locator)
                    .should('be.visible');
            };
        }
    } 

    shouldVerifyActionElements() {
        for(const productAction of actionElements) {
            cy.log(`verifying hidden product action element - ${productAction.name}`);

            this.getItem()
                .should('be.visible')
                .trigger('mouseover')
                .wait(500).as('actions');

            cy.get('@actions')   
                .get('.actions-secondary')
                .find(productAction.locator).first()
                .should('exist');
        }
    }

    selectSize(value?: string) {
        cy.log(`selecting size`);

        this.getAttribute('size').as('attribute');

        if(value) {
            cy.get('@attribute')
                .find('[role="option"]')
                .contains(value)
                .click();
        } else {
            cy.log(`Size option not found. Selecting first...`);
            cy.get('@attribute')
                .find('.swatch-option.text')
                .first()
                .click();
        }        
    }

    selectColor(value?: string) {
        cy.log(`selecting color`);

        this.getAttribute('color').as('attribute');

        if(value) {
            cy.get('@attribute')
            .find(`[option-label="${value}"]`)
            .should('be.visible')
            .click();
        } else {
            cy.log(`Color option not found. Selecting first...`);
            cy.get('@attribute')
                .find('.swatch-option.color')
                .first()
                .click();
        }
    }

    addToCart(isEquipment: boolean) {
        cy.log('adding to cart');

        if(!isEquipment) {
            this.selectSize();
            this.selectColor();
        }

        this.getItem()
            .trigger('mouseover')
            .wait(500).as('item');
     
        cy.get('@item')
            .find('.action.tocart')
            .click({force: true} );
    }

    addToWishlist() {
        cy.log('adding to wishlist');

        this.getItem()
            .trigger('mouseover')
            .wait(500).as('item');
         
        cy.get('@item')
            .get('[data-role="add-to-links"]')
            .find('a.action.towishlist').first()
            .click({force: true} );
    }
    
    addToComparision() {
        cy.log('adding to comparision');

        this.getItem()
            .trigger('mouseover')
            .wait(500).as('item');
        
        cy.get('@item')
            .get('[data-role="add-to-links"]')
            .find('a.action.tocompare').first()
            .click({force: true} );
    }

    getCompareTable() {
        cy.log('getting compare table');

        return cy.get('#product-comparison tr')
            .should('be.visible');
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