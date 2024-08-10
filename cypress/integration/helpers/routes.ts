/// <reference types="cypress"/>

class Routes {
    expect(key: string) {
        cy.log('expecting route');

        const [method, pattern] = this.getRoute(key);

        cy.intercept(method, pattern).as(key);
    }

    private getRoute(key:string) {
        switch (key) {
            case 'LoadPage': return ['GET', '/'];
            case 'SignUpPage': return ['GET', '/customer/account/create/'];
            case 'ResetPassword' : return ['POST, /customer/account/forgotpasswordpost/'];
            case 'SearchResults': return ['GET', '/catalogsearch/result/'];

            default: throw Error(`Unknown route key: ${key}`)
        }
    }

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