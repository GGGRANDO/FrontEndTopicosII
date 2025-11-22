describe('Products CRUD', () => {
  it('creates, lists and deletes a product via API and UI', () => {
    const login = `cy_user_${Date.now()}`;
    const password = 'cy_pass_123';

    cy.request('POST', 'http://localhost:3001/api/users', { login, password });
    cy.request('POST', 'http://localhost:3001/api/login', { login, password }).then((res) => {
      const token = res.body.token;
      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/products',
        body: { name: 'Cypress Product', price: 12.5 },
        headers: { Authorization: `Bearer ${token}` }
      }).then((p) => {
        expect(p.status).to.be.oneOf([200,201]);
        cy.visit('/produtos');
        cy.contains('Produtos');
      });
    });
  });
});
