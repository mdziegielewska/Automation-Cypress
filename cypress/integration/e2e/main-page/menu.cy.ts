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
    { tab: 'Tops', submenu: ['Jackets', 'Hoodies & Sweatshirts', 'Tees', 'Bras & Tanks'] },
    { tab: 'Bottoms', submenu: ['Pants', 'Shorts'] }
];

const actionLinks = [
    { action: 'Sign In', url: '/account/login/' },
    { action: 'Create an Account', url: '/customer/account/create/' }
];


describe('Menu', () => {

    beforeEach(() => {
        cy.visit('/');
    })

    menu.forEach(({tab, url, submenu}) => {
        it(`Should contain ${tab} in Menu`, () => {
            
            navigation.shouldContainTab(tab);
        
            if(submenu != null) {

                navigation.shouldBeExpandable(tab);

                submenu.forEach(subtab => {
                    const subSubMenuData = subMenu.find(item => item.tab === subtab)?.submenu;

                    if (subSubMenuData)  {
                        navigation.shouldBeExpandable(subtab);

                        subSubMenuData.forEach(subsubmenu => {
                            navigation.shouldContainSubtabLevel2(tab, subtab, subsubmenu);
                        })
                    } else {
                        navigation.shouldContainSubtabLevel1(tab, subtab);
                    }
                })
            }

            navigation.shouldVerifyRedirection(tab, url);
        })
    })

    actionLinks.forEach(({action, url}) => {
        it(`Should redirect to navigation link - ${action}`, () => {
            navigation.shouldVerifyNavigationLinks(action, url);
        })
    })
})