/// <reference types="cypress"/>

class Routes {

    /**
     * Sets up an intercept for a specific route pattern and assigns it an alias.
     * @param key The key for the route as defined in the getRoute method.
     */
    expect(key: string): void {
        cy.log('expecting route');

        const [method, pattern] = this.getRoute(key);

        cy.intercept(method, pattern).as(key);
    }

    /**
     * Visits a specific URL and then waits for a previously expected route to complete.
     * @param url The URL path to visit.
     * @param routeKey The key for the route that was set up with `routes.expect()` and should be waited for.
     */
    visitAndExpect(url: string, routeKey: string): void {
        cy.log(`Visiting ${url} and waiting for route: ${routeKey}`);

        cy.visit(url);
        this.expect(routeKey);
    }

    private getRoute(key: string) {
        switch (key) {
            case 'CartPage': return ['GET', '/checkout/cart/'];
            case 'ChangeQty': return ['POST', '/checkout/sidebar/updateItemQty/'];
            case 'CheckoutPage': return ['GET', '/checkout/'];
            case 'CouponResult': return ['POST', '/checkout/cart/couponPost/'];
            case 'DeleteResult': return ['POST', '/checkout/cart/delete/'];
            case 'EditPage': return ['GET', '/checkout/cart/configure/'];
            case 'HoodiePDP': return ['GET', '/circe-hooded-ice-fleece.html'];
            case 'Limiter': return ['GET', '/women/tops-women.html?product_list_limit='];
            case 'ListingPage': return ['GET', '/women/tops-women/hoodies-and-sweatshirts-women.html'];
            case 'LoadPage': return ['GET', '/'];
            case 'Mode': return ['GET', '/women/tops-women.html?product_list_mode='];
            case 'ResetPassword': return ['POST', '/customer/account/forgotpasswordpost/'];
            case 'SearchResults': return ['GET', '/catalogsearch/result/'];
            case 'Sorter': return ['GET', '/women/tops-women.html?product_list_order='];
            case 'UpdateResult': return ['POST', '/checkout/cart/updateItemOptions/'];
            case 'WaterBottlePDP': return ['GET', '/affirm-water-bottle.html'];

            default: throw Error(`Unknown route key: ${key}`)
        }
    }

    /**
     * Sends a custom HTTP request using cy.request.
     * @param url The URL for the request.
     * @param method The HTTP method (e.g., 'GET', 'POST').
     * @param body The request body (if applicable).
     */
    sendRequest(url: string, method: string, body: string) {
        cy.log('sending request');

        cy.request({
            method: method,
            url: url,
            body: body
        }).then(response => {
            expect(response.status).to.be.eq(200);
        });
    }
}

export const routes = new Routes();