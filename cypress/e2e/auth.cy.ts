describe('Auth flow', () => {
  it('registers and logs in using API and visits protected page', () => {
    const login = `cy_user_${Date.now()}`;
    const password = 'cy_pass_123';

    cy.request('POST', 'http://localhost:3001/api/users', { login, password }).then((r) => {
      expect([200,201]).to.include(r.status);
      cy.request('POST', 'http://localhost:3001/api/login', { login, password }).then((res) => {
        expect(res.status).to.eq(200);
        const token = res.body.token;
        window.localStorage.setItem('auth_token', token);
        cy.visit('/usuarios');
        cy.contains('Painel de Usuários');
      });
    });
  });
});
