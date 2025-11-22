describe('Orders flow', () => {
  it('creates products and an order via API then visits orders page', () => {
    const login = `cy_user_${Date.now()}`;
    const password = 'cy_pass_123';

    cy.request('POST', 'http://localhost:3001/api/users', { login, password });
    cy.request('POST', 'http://localhost:3001/api/login', { login, password }).then((res) => {
      const token = res.body.token;
      cy.request({ method: 'POST', url: 'http://localhost:3001/api/products', body: { name: 'Prod A', price: 5 }, headers: { Authorization: `Bearer ${token}` } }).then(p1 => {
        cy.request({ method: 'POST', url: 'http://localhost:3001/api/products', body: { name: 'Prod B', price: 7 }, headers: { Authorization: `Bearer ${token}` } }).then(p2 => {
          cy.request({ method: 'POST', url: 'http://localhost:3001/api/orders', body: { customerName: 'Cypress', customerEmail: 'c@ex.com', productIds: [p1.body.id, p2.body.id] }, headers: { Authorization: `Bearer ${token}` } }).then(o => {
            expect(o.status).to.be.oneOf([200,201]);
            window.localStorage.setItem('auth_token', token);
            cy.visit('/pedidos');
            cy.contains('Pedidos');
          });
        });
      });
    });
  });
});
