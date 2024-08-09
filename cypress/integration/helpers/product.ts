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

            cy.get('.product-item-details')
                .should('be.visible')
                .invoke('show').as('actions');

            cy.get('@actions')   
                .get('.actions-secondary')
                .find(productAction.locator).first()
                .should('exist');
        }
    }
}

export const product = new Product(); 