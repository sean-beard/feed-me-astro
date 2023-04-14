/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getByDataTestId(id: string): Chainable<JQuery<HTMLElement>>;
  }
}
