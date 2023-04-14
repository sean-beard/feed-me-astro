describe("Authentication", () => {
  it("logs in properly", () => {
    const baseUrl = Cypress.config("baseUrl") ?? "";
    const page = cy.visit(baseUrl);

    page.get("h1 > a").should("have.text", "FeedMe");

    cy.getByDataTestId("nav-login-link").click();

    cy.origin(
      "https://github.com",
      {
        args: {
          username: Cypress.env("GITHUB_USERNAME"),
          password: Cypress.env("GITHUB_PASSWORD"),
        },
      },
      ({ username, password }) => {
        cy.get("input#login_field").type(username);
        cy.get("input#password").type(password, { log: false });
        cy.get("input[name='commit']").click();
      }
    );

    // wait for redirect from auth callback
    page.get("h1 > a").should("have.text", "FeedMe");

    cy.url().should("equal", baseUrl + "/");
  });
});
