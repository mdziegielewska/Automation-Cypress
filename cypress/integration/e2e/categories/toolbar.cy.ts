/// <reference types="cypress"/>

import { listing } from "../../helpers/listings";
import { routes } from "../../helpers/routes";


const limiter = [36, 24, 12];
const sortType = ['Position', 'Product Name', 'Price'];
const mode = ['list', 'grid'];


describe('Listings - Toolbar', () => {

    beforeEach(() => {

        cy.visit('/women/tops-women.html');
    })

    limiter.forEach((limiter) => {
        it(`Should verify limiter per page - ${limiter} `, () => {

            listing.shouldChangeLimiter(limiter);

            routes.expect('Limiter');
            listing.shouldVerifyProductsNumber(limiter);
        })
    })

    sortType.forEach((sortType) => {
        it(`Should verify sorting options - ${sortType}`, () => {

            listing.shouldSortBy(sortType);

            routes.expect('Sorter');
            listing.shouldVerifySorting(sortType);
        })
    })

    mode.forEach((mode) => {
        it(`Should verify display mode - ${mode}`, () => {

            listing.shouldChangeModes(mode);

            routes.expect('Mode');
            listing.shouldVerifyCurrentMode(mode);
        })
    })
})