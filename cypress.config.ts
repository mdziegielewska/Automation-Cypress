import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/mochawesome-report/screenshots',
  downloadsFolder: 'cypress/downloads',
  viewportWidth: 1280,
  viewportHeight: 800,
  video: false,
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
  execTimeout: 60000,
  taskTimeout: 25000,
  pageLoadTimeout: 60000,
  requestTimeout: 60000,
  e2e: {
    setupNodeEvents(on, config) {
    },
    specPattern: 'cypress/integration/e2e/**/*.cy.{js,jsx,ts,tsx}',
    baseUrl: 'https://magento.softwaretestingboard.com/',
    supportFile: 'cypress/support/e2e.ts',
  }
})
