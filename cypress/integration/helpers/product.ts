/// <reference types="cypress"/>

const productCell = [
    { name: 'image', locator: '.product-image-photo' },
    { name: '.title',  locator: '.product-item-name' },
    { name: 'reviews', locator: '.rating-result' },
    { name: 'price',  locator: '.normal-price' },
    { name: 'size',  locator: '.swatch-attribute.size' },
    { name: 'colors',  locator: '.swatch-attribute.color' },
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

    shouldVerifyProductCellElements() {
        cy.log('verifying product info elements');

        for(const productInfo of productCell) {
            cy.get(productInfo.locator)
                .should('be.visible');
        } 
    }

    shouldVerifyHiddenElements() {
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

    selectSize(value: string) {
        cy.log(`selecting size`);

        this.getAttribute('size').as('attribute');

        cy.get('@attribute')
            .find('[role="option"]')
            .contains(value)
            .click();
    }

    selectColor(value: string) {
        cy.log(`selecting color`);

        this.getAttribute('color').as('attribute');

        cy.get('@attribute')
            .find(`[option-label="${value}"]`)
            .click();
    }

    addToCart() {
        cy.log('adding to cart');

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
}

export const product = new Product(); 