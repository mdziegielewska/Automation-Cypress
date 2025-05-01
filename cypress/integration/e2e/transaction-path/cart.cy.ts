import { cart } from '../../helpers/cart';
import { navigation } from '../../helpers/navigation';
import { product } from '../../helpers/product';
import { results } from '../../helpers/results';


let productName: string;
let ADD_TO_CART_MESSAGE: string;
let UPDATE_MESSAGE: string;


describe('Transaction path - Cart', () => {

    beforeEach(() => {
        cy.visit('/women/tops-women/hoodies-and-sweatshirts-women.html');

        product.getProductName().then(name => {

            productName = name.trim();

            ADD_TO_CART_MESSAGE = `You added ${productName} to your shopping cart.`;
            UPDATE_MESSAGE = `${productName} was updated in your shopping cart.`;

            product.addToCart(false);
            results.shouldVerifyPageMessage(ADD_TO_CART_MESSAGE);

            cy.visit('/checkout/cart/');
        });
    });

    it.only('Should display all cart elements after adding item', () => {
        results.shouldVerifyPageTitle('Shopping Cart');

        cart.verifyProductDetailsInCart();
    });

    it('Should edit product from cart', () => {

        cart.editCartItem('cart');
        cart.updateCart();

        results.shouldVerifyPageMessage(UPDATE_MESSAGE);
    });

    it('Should delete product from cart', () => {

        cart.deleteCartItem('cart');
        cart.shouldBeEmpty();
    });

    it('Should increase product quantity', () => {
    });

    it('Should redirect to product page after clicking thumbnail', () => {
    });

    it('Should proceed to checkout as guest', () => {
    });

    it('Should proceed to checkout as logged-in user', () => {
    });
});