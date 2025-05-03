/// <reference types="cypress"/>

class Routes {

    /**
     * Sets up an intercept for a specific route pattern and assigns it an alias.
     * @param key The key for the route as defined in the getRoute method.
     */
    expect(key: string): void {
        cy.log('Expecting route');

        const [method, pattern] = this.getRoute(key);

        cy.intercept(method, pattern).as(key);
    }

    /**
     * Visits a specific URL and then waits for a previously expected route to complete.
     * @param url The URL path to visit (Optional).
     * @param routeKey The key for the route that was set up with `routes.expect()` and should be waited for.
     */
    visitAndWait(routeKey: string, url?: string): void {
        cy.log(`Visiting and waiting for route: ${routeKey}`);

        this.expect(routeKey);

        if (url) {
            cy.visit(url);
        } else {
            cy.visit(this.getRoute(routeKey)[1]);
        }

        cy.wait(`@${routeKey}`);
    }

    /**
     * Retrieves the HTTP method and URL pattern for a given route key.
     * @param key The key identifying the desired route.
     * @returns A tuple containing the HTTP method (string) and the URL pattern (string).
     * @throws Error if the route key is unknown.
     */
    private getRoute(key: string): [string, string] {
        switch (key) {
            case 'AddToCartResult': return ['POST', '/checkout/cart/add/'];
            case 'AddToCompareResult': return ['POST', '/catalog/product_compare/add/'];
            case 'AddToWishlistResult': return ['POST', '/wishlist/index/add/'];
            case 'AdvancedSearchPage': return ['GET', '/catalogsearch/advanced/'];
            case 'AdvancedSearchResult': return ['GET', '/catalogsearch/advanced/result/'];
            case 'CartPage': return ['GET', '/checkout/cart/'];
            case 'ChangeQty': return ['POST', '/checkout/sidebar/updateItemQty/'];
            case 'CheckoutPage': return ['GET', '/checkout/'];
            case 'CompareProductsPage': return ['GET', '/catalog/product_compare/'];
            case 'CouponResult': return ['POST', '/checkout/cart/couponPost/'];
            case 'DeleteResult': return ['POST', '/checkout/cart/delete/'];
            case 'EditPage': return ['GET', '/checkout/cart/configure/'];
            case 'ForgotPasswordPage': return ['GET', '/customer/account/forgotpassword/'];
            case 'HoodiePDP': return ['GET', '/circe-hooded-ice-fleece.html'];
            case 'JunoJacketPDP': return ['GET', '/juno-jacket.html'];
            case 'Limiter': return ['GET', '/women/tops-women.html?product_list_limit='];
            case 'ListingPage': return ['GET', '/women/tops-women/hoodies-and-sweatshirts-women.html'];
            case 'ListingPantsPage': return ['GET', '/women/bottoms-women/pants-women.html'];
            case 'LoadPage': return ['GET', '/'];
            case 'LogInPage': return ['GET', '/customer/account/login/'];
            case 'LogInResult': return ['POST', '/customer/account/loginPost/'];
            case 'LogOut': return ['POST', '/customer/account/logout/'];
            case 'Mode': return ['GET', '/women/tops-women.html?product_list_mode='];
            case 'OrdersReturnsPage': return ['GET', '/sales/guest/form/'];
            case 'OrdersReturnsResult': return ['GET', '/sales/guest/view/'];
            case 'PrivacyPolicyPage': return ['GET', '/privacy-policy-cookie-restriction-mode'];
            case 'ResetPasswordResult': return ['POST', '/customer/account/forgotpasswordpost/'];
            case 'SearchResult': return ['GET', '/catalogsearch/result/'];
            case 'SearchTerms': return ['GET', '/search/term/popular/'];
            case 'SignUpPage': return ['GET', '/customer/account/create/'];
            case 'SignUpResult': return ['POST', '/customer/account/createpost/'];
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
    sendRequest(url: string, method: string, body: string): void {
        cy.log('Sending request');

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