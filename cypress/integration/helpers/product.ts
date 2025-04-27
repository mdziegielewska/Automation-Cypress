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
    { name: 'title',  locator: '.product-item-name' },
    { name: 'reviews', locator: '.rating-result' },
    { name: 'price',  locator: '.price' },
    { name: 'add to cart',  locator: '.action.tocart' }
]; 

const actionElements = [
    { name: 'wishlist',  locator: 'a.action.towishlist' },
    { name: 'compare',  locator: 'a.action.tocompare' }
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

    getRelated() {
        return cy.get('.products-related')
            .find('.product-item-info');
    }

    getTab(name: string, locator: string) {
        return cy.get('.product.info.detailed')
            .within(() => {
                cy.contains(name).click();
                cy.get(locator).should('be.visible');
            });
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

    shouldVerifyMainPDPElements() {
        for(const pdpElement of pdpElements) {
            cy.log(`verifying visibility of ${pdpElement.name}`)

            cy.get(pdpElement.locator)
                .should('be.visible');
        }
    }

    shouldVerifyTabSwitching(tabs: { name: string; locator: string; }[]) {
        for(const tab of tabs) {
            cy.log(`verifying clickability of ${tab.name} tab`);

            cy.get('.product.info.detailed')
                .within(() => {
                    cy.contains(tab.name).click();
                    cy.get(tab.locator).should('be.visible');
            });
        }
    }

    shouldVerifyMoreInformationSections() {
        const expectedSections = ['Style', 'Material', 'Pattern', 'Climate'];
        
        this.getTab('More Information', '#additional')
            .within(() => {
                expectedSections.forEach((section) => {
                    cy.log(`verifying section - ${section}`)
                    
                    cy.get('#additional')
                        .contains('th', section)
                        .should('be.visible');
                  });
            })
    }

    shouldDisplayDetailsSectionText() {
        cy.log('verifying description in details tab');

        this.getTab('Details', '#description')
            .should('not.be.empty')
            .and(($el) => {
                expect($el.text().trim().length).to.be.greaterThan(10);
          });
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

    selectProductSize() {
        cy.get('.swatch-attribute.size .swatch-option')
          .not('.disabled')
          .first()
          .click();
    }
      
    selectProductColor() {
        cy.get('.swatch-attribute.color .swatch-option')
          .not('.disabled')
          .first()
          .click();
    }

    addToCartPDP() {
        cy.log('adding to cart on PDP');

        this.selectProductSize();
        this.selectProductColor();

        cy.get('#product-addtocart-button')
            .should('be.visible')
            .click();
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