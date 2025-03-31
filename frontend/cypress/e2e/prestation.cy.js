describe('Test sur la page Prestation', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.contains('DÉCOUVRIR NOS PRESTATIONS').click();
        cy.url().should('include', '/prestation');
    });

    it('Vérifie la présence des catégories de prestations', () => {
        const categories = ['Événementielle', 'Beauté', 'Artisanat', 'Photographie'];

        cy.get('.types-categorie', { timeout: 10000 }).should('be.visible');

        categories.forEach((categorie) => {
            cy.get('.types-categorie') 
                .contains(new RegExp(categorie, "i"), { timeout: 10000 }) // pour ignore la casse
                .should('be.visible');
        });
    });

    it('Vérifie que la première prestation est affichée', () => {
        cy.get('.hero-image').should('be.visible');
        cy.get('.hero-text p').should('not.be.empty');
    });

    it('Teste le changement de catégorie', () => {
        cy.contains('BEAUTÉ').click(); 
        cy.url().should('include', '/prestation'); 
        cy.get('.services-title').should('contain', 'BEAUTÉ');
    });

    it('Vérifie que les sous-prestations s\'affiche', () => {
        cy.get('.service-row').should('have.length.greaterThan', 0);
    });
});
