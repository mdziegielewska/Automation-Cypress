/// <reference types="cypress"/>

import { results } from "../../helpers/results";
import { listing } from "../../helpers/listings";
import { product } from "../../helpers/product";


let productName: string;
let ADD_TO_CART_MESSAGE: string;
let ADD_TO_COMPARISION_MESSAGE: string;

const ADD_TO_WISHLIST_MESSAGE = "You must login or register to add items to your wishlist.";

const urls = [
    { name: 'Tops Women', url: '/women/tops-women.html', items: 50, isEquipment: false },
    { name: 'Jackets Women', url: '/women/tops-women/jackets-women.html', items: 12, isEquipment: false },
    { name: 'Hoodies & Sweatshirts Women', url: '/women/tops-women/hoodies-and-sweatshirts-women.html', items: 12, isEquipment: false },
    { name: 'Tees Women', url: '/women/tops-women/tees-women.html', items: 12, isEquipment: false },
    { name: 'Bras & Tanks Women', url: '/women/tops-women/tanks-women.html', items: 14, isEquipment: false },
    { name: 'Bottoms Women', url: '/women/bottoms-women.html', items: 25, isEquipment: false },
    { name: 'Pants Women', url: '/women/bottoms-women/pants-women.html', items: 13, isEquipment: false },
    { name: 'Shorts Women', url: '/women/bottoms-women/shorts-women.html', items: 12, isEquipment: false },
    { name: 'Tops Men', url: '/men/tops-men.html', items: 48, isEquipment: false },
    { name: 'Jackets Men', url: '/men/tops-men/jackets-men.html', items: 11, isEquipment: false },
    { name: 'Hoodies & Sweatshirts Men', url: '/men/tops-men/hoodies-and-sweatshirts-men.html', items: 13, isEquipment: false },
    { name: 'Tees Men', url: '/men/tops-men/tees-men.html', items: 12, isEquipment: false },
    { name: 'Tanks Men', url: '/men/tops-men/tanks-men.html', items: 12, isEquipment: false },
    { name: 'Bottoms Men', url: '/men/bottoms-men.html', items: 24, isEquipment: false },
    { name: 'Pants Men', url: '/men/bottoms-men/pants-men.html', items: 12, isEquipment: false },
    { name: 'Shorts Men', url: '/men/bottoms-men/shorts-men.html', items: 12, isEquipment: false },
    { name: 'Bags', url: '/gear/bags.html', items: 14, isEquipment: true },
    { name: 'Fitness Equipment', url: '/gear/fitness-equipment.html', items: 11, isEquipment: true },
    { name: 'Watches', url: '/gear/watches.html', items: 9, isEquipment: true }
];


urls.forEach(({name, url, items, isEquipment}) => {
    describe(`Listing - ${name}`, () => {

        beforeEach(() => {
            cy.clearAllCookies();
            cy.visit(url);
        })
    
        it('Should contain listing elements', () => {

            listing.shouldVerifyListingElements();
            
            listing.shouldContainFilterBlock();
            listing.shouldContainAdditionalSidebar();
            listing.shouldChangeLimiter(36);
        })
    
        it('Product Item should contain elements', () => {
    
            product.shouldVerifyProductCellElements(isEquipment);
            product.shouldVerifyActionElements();
        }) 
    
        it('Should add to Cart', () => {
            product.getProductName().then(name => {

                productName = name.trim();
                
                ADD_TO_CART_MESSAGE = `You added ${productName} to your shopping cart.`;
    
                product.addToCart(isEquipment);
                results.shouldVerifyPageMessage(ADD_TO_CART_MESSAGE);
            });
        })
    
        it('Should add to Wishlist', () => {
    
            product.addToWishlist();
            results.shouldVerifyPageMessage(ADD_TO_WISHLIST_MESSAGE);
    
            cy.url()
                .should('contain', '/customer/account/login/');
        })
    
        it('Should add to Comparision', () => {

            product.getProductName().then(name => {
                productName = name.trim();
    
                ADD_TO_COMPARISION_MESSAGE = `You added product ${productName} to the comparison list.`;
    
                product.addToComparision();
                results.shouldVerifyPageMessage(ADD_TO_COMPARISION_MESSAGE);
            });
        })
    })
})