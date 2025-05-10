/// <reference types="cypress"/>

import { PRODUCT_SELECTORS } from '../selectors/productSelectors';
import { forms } from './forms';


class Reviews {

    /**
     * Gets the number of reviews displayed in the review count element.
     * @returns A Cypress chainable that resolves to the number of reviews as a number.
     */
    private getReviewCount(): Cypress.Chainable<number> {
        return cy.get(PRODUCT_SELECTORS.viewReviewCount)
            .invoke('text')
            .then(text => parseInt(text.match(/\d+/)?.[0] || '0', 10));
    }

    /**
     * Verifies the visibility and content of the main review summary elements.
     * Asserts that the number of reviews is greater than 0.
     */
    verifyReviewsSummaryElements(): void {
        cy.log('Verifying review summary elements');

        cy.get(PRODUCT_SELECTORS.reviewsSummary).should('be.visible');

        cy.get(PRODUCT_SELECTORS.addReviewButton)
            .should('be.visible')
            .and('contain.text', 'Add Your Review');

        cy.get(PRODUCT_SELECTORS.ratingSummary).should('be.visible');

        this.getReviewCount()
            .then(reviewsNumber => {
                expect(reviewsNumber).to.be.greaterThan(0);
            });
    }

    /**
     * Clicks the "Add Your Review" button.
     */
    clickAddYourReview(): void {
        cy.log('Clicking on add your review');

        cy.get(PRODUCT_SELECTORS.addReviewButton).click();
    }

    /**
     * Verifies that the user has been redirected to the reviews tab.
     */
    verifyRedirectedToReviewsTab(): void {
        cy.log('Redirecting to reviews tab');

        cy.get(PRODUCT_SELECTORS.reviewsTabActive).should('have.id', 'tab-label-reviews');
    }

    /**
     * Verifies that the number of displayed review items matches the expected count from the summary.
     */
    verifyCorrectNumberOfReviews(): void {
        cy.log('Verifying number of reviews');

        this.getReviewCount()
            .then(expectedReviewsCount => {
                this.clickAddYourReview();
                cy.get(PRODUCT_SELECTORS.reviewItems).should('have.length', expectedReviewsCount);
            });
    }

    /**
     * Fills out the review form fields and selects a rating.
     * @param rating - The star rating to select (e.g., 1, 2, 3, 4, 5).
     * @param reviewData - An array of objects containing the selector and text to fill in form fields.
     */
    fillReviewForm(rating: number, reviewData: { selector: string; text: any; }[]): void {
        cy.log('Filling review data');

        for (const data of reviewData) {
            forms.fillField(data.selector, data.text);
        }

        cy.get(PRODUCT_SELECTORS.ratingLabel(rating))
            .first()
            .click({ force: true });
    }

    /**
     * Clicks the submit button for the review form.
     */
    submitReview(): void {
        cy.log('Submitting review');

        cy.get(PRODUCT_SELECTORS.submitButton).click();
    }
}

export const reviews = new Reviews();