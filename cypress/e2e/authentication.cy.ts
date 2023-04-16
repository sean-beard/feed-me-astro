import { getBaseUrl, login } from "./helpers";

describe("Authentication", () => {
  it("logs in properly", () => {
    const baseUrl = getBaseUrl();
    const page = cy.visit(baseUrl);

    login(page);

    cy.url().should("equal", baseUrl + "/");
  });
});
