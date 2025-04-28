/// <reference types="cypress"/>

import { SELECTORS } from '../helpers/selectors';


class Reviews {
    private getReviewCount() {
        return cy.get(SELECTORS.viewReviewCount)
            .invoke('text')
            .then(text => parseInt(text.match(/\d+/)?.[0] || '0', 10));
    }

    verifyReviewsSummaryElements() {
        cy.log('verifying review summary elements');

        cy.get(SELECTORS.reviewsSummary).should('be.visible');

        cy.get(SELECTORS.addReviewButton)
            .should('be.visible')
            .and('contain.text', 'Add Your Review');

        cy.get(SELECTORS.ratingSummary).should('be.visible');

        this.getReviewCount()
            .then(reviewsNumber => {

                expect(reviewsNumber).to.be.greaterThan(0);
            });
    }

    clickAddYourReview() {
        cy.log('clicking on add your review');

        cy.get(SELECTORS.addReviewButton).click();
    }

    verifyRedirectedToReviewsTab() {
        cy.log('redirecting to reviews tab');

        cy.get(SELECTORS.reviewsTab)
            .should('have.id', 'tab-label-reviews');
    }

    verifyCorrectNumberOfReviews() {
        cy.log('verifying number of reviews');

        this.getReviewCount()
            .then(expectedReviewsCount => {
                this.clickAddYourReview();

                cy.get(SELECTORS.reviewItems)
                    .should('have.length', expectedReviewsCount);
            });
    }

    fillReviewForm(rating: number, reviewData: { selector: string; text: any; }[]) {
        cy.log('filling review data');

        for (const data of reviewData) {

            cy.get(data.selector)
                .type(data.text);
        }

        cy.get(`label#Rating_${rating}_label`).first().click({ force: true });
    }

    submitReview() {
        cy.log('submitting review');

        cy.get(SELECTORS.submitButton).click();
    }
}

export const reviews = new Reviews();