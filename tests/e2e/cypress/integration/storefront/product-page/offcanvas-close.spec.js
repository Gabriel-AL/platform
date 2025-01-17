import CheckoutPageObject from '../../../support/pages/checkout.page-object';

let product = {};

describe('Test if the offcanvas menus could be closed with the browser back button', () => {
    beforeEach(() => {
        cy.createProductFixture().then(() => {
            return cy.createDefaultFixture('category');
        }).then(() => {
            return cy.fixture('product');
        }).then((result) => {
            product = result;
            cy.visit('/');
        });
    });

    it('Should close offcanvas on browser back', () => {
        // set to mobile viewport
        cy.viewport(360, 640);

        // go to product
        cy.get('.search-toggle-btn').click();
        cy.get('.header-search-input').should('be.visible');
        cy.get('.header-search-input').type(product.name);
        cy.get('.search-suggest-product-name').contains(product.name);
        cy.get('.search-suggest-product-price').contains(product.price[0].gross);
        cy.get('.search-suggest-product-name').click();
        cy.get('.product-detail-name').contains(product.name);

        // open offcanvas (product description)
        cy.get('#description-tab').click();
        cy.get('.offcanvas.is-open').should('be.exist');
        cy.get('.offcanvas .product-detail-description-title').contains(product.name);

        // close offcanvas with browser back
        cy.go('back');
        cy.get('.offcanvas').should('not.exist');

        // ensure, it is still the product detail page
        cy.get('.product-detail-name').contains(product.name);

        // ensure normal closing via click still works
        cy.get('.header-cart').click();
        cy.get('.offcanvas.is-open').should('be.exist');
        cy.get('.offcanvas .offcanvas-cart-header').contains('Shopping cart');
        cy.get('.offcanvas.is-open .offcanvas-close').click();
        cy.get('.offcanvas').should('not.exist');

        // ensure, it is still the product detail page
        cy.get('.product-detail-name').contains(product.name);
    });

    it('Should close offcanvas on clicking on backdrop', () => {
        cy.window().then((win) => {
            const page = new CheckoutPageObject();

            /** @deprecated tag:v6.5.0 - Use `CheckoutPageObject.elements.lineItem` instead */
            const lineItemSelector = win.features['v6.5.0.0'] ? '.line-item' : '.cart-item';

            // add product to cart
            cy.get('.header-search-input')
                .should('be.visible')
                .type(product.name);
            cy.contains('.search-suggest-product-name', product.name).click();
            cy.get('.product-detail-buy .btn-buy').click();

            // Off canvas
            cy.get(`${page.elements.offCanvasCart}.is-open`).should('be.visible');
            cy.get(`${lineItemSelector}-label`).contains(product.name);

            // close offcanvas with backdrop click
            cy.get('.modal-backdrop').click();
            cy.get('.offcanvas.is-open').should('not.exist');
            cy.get('.modal-backdrop').should('not.exist');

            // ensure, it is still the product detail page
            cy.get('.product-detail-name').contains(product.name);

            // ensure normal closing via click still works
            cy.get('.header-cart').click();
            cy.get('.offcanvas.is-open').should('be.visible');
            cy.get('.offcanvas .offcanvas-cart-header').contains('Shopping cart');
            cy.get('.offcanvas.is-open .offcanvas-close').click();
            cy.get('.offcanvas').should('not.exist');

            // ensure, it is still the product detail page
            cy.get('.product-detail-name').contains(product.name);
        });
    });
});
