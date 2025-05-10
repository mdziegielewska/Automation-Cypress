/// <reference types="cypress"/>

import { results } from '../../helpers/results';
import { reviews } from '../../helpers/reviews';
import { routes } from '../../helpers/routes';
import { PRODUCT_SELECTORS } from '../../selectors/productSelectors';


const reviewForm = [
    { selector: PRODUCT_SELECTORS.reviewField, text: Cypress.env("REVIEW") },
    { selector: PRODUCT_SELECTORS.nicknameField, text: Cypress.env("TEST_FIRST_NAME") },
    { selector: PRODUCT_SELECTORS.summaryField, text: 'Perfect!' }
];

const REVIEW_SUBMISSION_MESSAGE = 'You submitted your review for moderation.';


describe('PDP - Reviews', () => {

    beforeEach(() => {
        cy.clearAllCookies()
        routes.visitAndWait('JunoJacketPDP');
    });

    it('Should verify review summary elements', () => {
        reviews.verifyReviewsSummaryElements();
    });

    it('Should redirect to reviews tab', () => {
        reviews.clickAddYourReview();

        reviews.verifyRedirectedToReviewsTab();
        reviews.verifyCorrectNumberOfReviews();
    });

    it('Should add a new review', () => {
        reviews.clickAddYourReview();

        reviews.fillReviewForm(5, reviewForm);
        reviews.submitReview();
        results.shouldVerifyPageMessage(REVIEW_SUBMISSION_MESSAGE);
    });
})