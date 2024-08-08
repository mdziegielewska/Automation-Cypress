/// <reference types="cypress"/>

import { navigation } from '../../helpers/navigation';


const menu = [
    { tab: 'What\'s New', url: '/what-is-new.html', submenu: null }, 
    { tab: 'Women', url: '/women.html', submenu: ['Tops', 'Bottoms'] }, 
    { tab: 'Men', url: '/men.html', submenu: ['Tops', 'Bottoms'] }, 
    { tab: 'Gear', url: '/gear.html', submenu: ['Bags', 'Fitness Equipment', 'Watches'] }, 
    { tab: 'Training', url: '/training.html', submenu: ['Video Download'] }, 
    { tab: 'Sale', url: '/sale.html', submenu: null }, 
]

const subMenu = [
    { tab: 'Tops', url: `/tops-women.html`, submenu: ['Jackets', 'Hoodies & Sweatshirts', 'Tees', 'Tanks'] },
    { tab: 'Bottoms', url: `` , submenu: ['Pants', 'Shorts'] }
];


describe('Menu', () => {

    beforeEach(() => {
        cy.visit('/');
    })

    menu.forEach(({tab, url, submenu}) => {
        it(`Should contain ${tab} in menu`, () => {
            
            navigation.shouldContainTab(tab);
        
            if(submenu != null) {

                navigation.shouldBeExpandable(tab);

                submenu.forEach(subtab => {
                    navigation.shouldContainSubtab(tab, subtab);
                })
            }

            navigation.shouldVerifyRedirection(tab, url);
        })
    })
})