import { getBaseUrl } from "../e2e/helpers";

Cypress.Commands.add("getByDataTestId", (id) => {
  return cy.get(`[data-test-id=${id}]`);
});

Cypress.Commands.add("subscribe", (feedUrl) => {
  cy.getByDataTestId("manage-feeds-link").click();

  cy.get("input#feedUrl").type(feedUrl);

  cy.intercept(Cypress.env("apiBaseUrl") + "/subscription").as(
    "subscribeRequest",
  );

  cy.getByDataTestId("subscribe-button").click();

  cy.wait("@subscribeRequest");
});

Cypress.Commands.add("unsubscribe", (feedName) => {
  cy.getByDataTestId("manage-feeds-link").click();

  cy.intercept(Cypress.env("apiBaseUrl") + "/subscription").as(
    "unsubscribeRequest",
  );

  cy.contains(feedName).parent().get("button#unsubscribeButton").click();

  cy.wait("@unsubscribeRequest");
});

Cypress.Commands.add("markAllAsUnread", () => {
  cy.getByDataTestId("home-link").click();

  const baseUrl = getBaseUrl();
  cy.intercept(baseUrl + "/item.json").as("itemUpdateRequest");

  cy.get(".desktop-filter").click();
  cy.getByDataTestId("toggle-select-all").click({ force: true });
  cy.contains("Mark as Unread").click();

  cy.wait("@itemUpdateRequest");
});
