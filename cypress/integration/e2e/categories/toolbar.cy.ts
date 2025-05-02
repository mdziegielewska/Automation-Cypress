/// <reference types="cypress"/>

import { listing } from "../../helpers/listings";
import { routes } from "../../helpers/routes";


const limiter = [36, 24, 12];
const sortType = ['Position', 'Product Name', 'Price'];
const mode = ['list', 'grid'];


describe('Listings - Toolbar Verification', () => {

    beforeEach(() => {
        cy.visit('/women/tops-women.html');
    })

    limiter.forEach((limiter) => {
        it(`Should verify limiter per page - ${limiter} `, () => {
            routes.expect('Limiter');
            listing.shouldChangeLimiter(limiter);
            cy.wait('@Limiter');

            listing.shouldVerifyProductsNumber(limiter);
        })
    })

    sortType.forEach((sortType) => {
        it(`Should verify sorting options - ${sortType}`, () => {
            routes.expect('Sorter');
            listing.shouldSortBy(sortType);
            cy.wait('@Sorter');

            listing.shouldVerifySorting(sortType);
        })
    })

    mode.forEach((mode) => {
        it(`Should verify display mode - ${mode}`, () => {
            routes.expect('Mode');
            listing.shouldChangeModes(mode);
            cy.wait('@Mode');

            listing.shouldVerifyCurrentMode(mode);
        })
    })
})