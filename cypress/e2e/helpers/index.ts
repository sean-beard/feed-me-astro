export const getBaseUrl = (): string => {
  return Cypress.config("baseUrl") ?? "";
};

export const login = (page: Cypress.Chainable<Cypress.AUTWindow>) => {
  const username = Cypress.env("GITHUB_USERNAME");
  const password = Cypress.env("GITHUB_PASSWORD");

  cy.getByDataTestId("nav-login-link").click();

  cy.origin(
    "https://github.com",
    {
      args: {
        username,
        password,
      },
    },
    ({ username, password }) => {
      cy.get("input#login_field").type(username);
      cy.get("input#password").type(password, { log: false });
      cy.get("input[name='commit']").click();
    }
  );

  // wait for redirect from auth callback
  page.getByDataTestId("home").should("be.visible");
};
