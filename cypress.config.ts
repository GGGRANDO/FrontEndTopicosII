import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents() {},
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}'
  }
});
