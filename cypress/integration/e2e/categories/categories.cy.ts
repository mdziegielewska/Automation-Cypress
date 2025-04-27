/// <reference types="cypress"/>

import { listing } from '../../helpers/listings';
import { results } from '../../helpers/results';
import { widgets } from '../../helpers/widgets';


const whatsNew = [
    { name: 'New Luma Yoga Collection', info: 'New Luma Yoga Collection', url: '/yoga-new.html' },
    { name: 'Performance Sportswear New', info: "Luma Cocona", url: '/performance-new.html' },
    { name: 'Eco Collection New', info: 'Enjoy comfort of body and mind with Luma eco-friendly choices', url: '/eco-new.html' }
];

const women = [
    { name: 'Women', info: 'New Luma Yoga Collection', url: '/women.html' },
    { name: 'Tees', info: '4 tees for the price of 3. Right now', url: '/tees-women.html' },
    { name: 'Pants 20\% OFF', info: 'Luma pants when you shop today', url: '/pants-women.html' },
    { name: 'Erin Recommends', info: 'It’s no secret: see Luma founder Erin Renny’s wardrobe go-to’s', url: '/erin-recommends.html' },
    { name: 'Pants', info: 'Pants for yoga, gym and outdoors', url: '/pants-women.html' },
    { name: 'Shorts', info: 'Exercise comfort', url: '/shorts-women.html' },
    { name: 'Bras & Tanks', info: 'Stock up for summer!', url: '/tanks-women.html' }
];

const men = [
    { name: 'Men', info: 'Luma’s Performance Fabric collection', url: '/men.html' },
    { name: 'Tees', info: 'Buy 3 Luma tees, get 4 instead', url: '/tees-men.html' },
    { name: 'Save up to \$24', info: '20\% OFF', url: '/pants-men.html' },
    { name: 'Shorts', info: 'Cool it now', url: '/shorts-men.html' },
    { name: 'Tees', info: 'Grab a tee or two!', url: '/tees-men.html' },
    { name: 'Hoodies', info: 'Dress for fitness', url: '/hoodies-and-sweatshirts-men.html' }
];

const gear = [
    { name: 'Gear', info: 'Save up to 20\%', url: '/gear.html' },
    { name: 'Loosen Up', info: 'Extend your training with yoga straps, tone bands', url: '/fitness-equipment.html' },
    { name: 'Here’s to you!', info: '\$4 Luma water bottle', url: '/fitness-equipment.html' },
    { name: 'Bags', info: 'Luma bags go the distance', url: '/bags.html' },
    { name: 'Fitness Equipment', info: 'Luma gym equipment fits your goals', url: '/fitness-equipment.html' },
    { name: 'Watches', info: 'Keeping pace has never been more stylish', url: '/watches.html' }
];

const sale = [
    { name: 'Women Sale', info: 'Women’s Deals', url: '/women-sale.html' },
    { name: 'Men Sale', info: 'Stretch your budget with active attire', url: '/men-sale.html' },
    { name: 'Gear', info: 'Your best efforts deserve a deal', url: '/gear.html' },
    { name: '20\% OFF', info: 'Every \$200-plus purchase!', url: null },
    { name: 'Free shipping', info: 'Buy more, save more', url: null },
    { name: 'Tees', info: '4 tees for the price of 3. Right now', url: '/tees-women.html' }
];

const categories = [
    { category: 'What\'s New', url: '/what-is-new.html', widget: whatsNew, grid: 'Luma\'s Latest' },
    { category: 'Women', url: '/women.html', widget: women, grid: 'Hot Sellers' },
    { category: 'Men', url: '/men.html', widget: men, grid: 'Hot Sellers' },
    { category: 'Gear', url: '/gear.html', widget: gear, grid: 'Hot Sellers' },
    { category: 'Sale', url: '/sale.html', widget: sale, grid: null }
];


categories.forEach(({ category, url, widget, grid }) => {
    describe(`Categories - ${category}`, () => {

        beforeEach(() => {

            cy.visit(url);
        })

        const widgetBlocks = '.block-promo';
        const gridBlocks = '.content-heading';

        widget.forEach(({ name, info, url }, index) => {
            it(`Should contain widget - ${name}`, () => {

                widgets.shouldVerifyNumberOfElements(widgetBlocks, widget.length);

                widgets.shouldVerifyWidgetInfo(index, info);

                if (url == null) {
                    cy.log('No url. Passing...');

                } else {
                    widgets.shouldVerifyUrl(widgetBlocks, index, url);
                }
            })
        })

        if (grid !== null) {
            it('Should show Grid Widget', () => {

                results.shouldVerifyTextInSection(gridBlocks, grid);

                widgets.getGridWidget().as('products');
                widgets.shouldVerifyNumberOfElements('@products', 4);
            })
        }

        it('Should contain Sidebar', () => {

            listing.shouldContainFilterBlock();
            listing.shouldContainAdditionalSidebar();
        })
    })
})