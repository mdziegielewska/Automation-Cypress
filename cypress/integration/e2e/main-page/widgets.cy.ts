/// <reference types="cypress"/>

import { widgets } from "../../helpers/widgets";

const widget = [
    { name: 'Yoga', info: 'New Luma Yoga Collection', url: '/yoga-new.html' },
    { name: 'Pants', info: 'Luma pants when you shop today', url: '/pants-all.html' },
    { name: 'Tees', info: 'Buy 3 Luma tees get a 4th free', url: '/tees-all.html' },
    { name: 'Erin Recommendations', info: 'Luma founder Erin Renny shares her favorites', url: '/erin-recommends.html' },
    { name: 'Performance Fabrics', info: "Wicking to raingear", url: '/performance-fabrics.html' },
    { name: 'Eco Friendly', info: 'Find conscientious, comfy clothing in our eco-friendly collection', url: '/eco-friendly.html' },
];


describe('Main page - Widgets', () => {

    beforeEach(() => {

        cy.visit('/');
    })

    const widgetBlocks = '.block-promo';

    widget.forEach(({ name, info, url }, index) => {
        it(`Should contain widget - ${name}`, () => {

            widgets.shouldVerifyNumberOfElements(widgetBlocks, widget.length);

            widgets.shouldVerifyWidgetInfo(index, info);
            widgets.shouldVerifyUrl(widgetBlocks, index, url);
        })
    })
})