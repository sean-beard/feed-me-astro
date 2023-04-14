Cypress.Commands.add("getByDataTestId", (id) => {
  return cy.get(`[data-test-id=${id}]`);
});
