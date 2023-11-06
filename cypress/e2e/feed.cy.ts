import { getBaseUrl, login } from "./helpers";

describe("Feed", () => {
  const baseUrl = getBaseUrl();

  beforeEach(() => {
    const page = cy.visit(baseUrl);

    login(page);
  });

  it("should handle articles", () => {
    cy.subscribe("https://cprss.s3.amazonaws.com/frontendfoc.us.xml");

    cy.getByDataTestId("home-link").click();

    cy.get(".card-panel").first().click();

    cy.get(".feed-item-page-container").should("be.visible");

    const toggleButton = cy.get(".toggle-btn");

    toggleButton.should("have.text", "Mark as read");

    cy.intercept(baseUrl + "/item.json").as("itemUpdateRequest");
    cy.wait(2000);
    toggleButton.click();
    cy.wait("@itemUpdateRequest");

    toggleButton.should("not.be.disabled");
    toggleButton.should("have.text", "Mark as unread");

    cy.markAllAsUnread();
    cy.unsubscribe("Frontend Focus");
  });

  it("should handle podcasts", () => {
    cy.subscribe("https://feeds.npr.org/510318/podcast.xml");

    cy.getByDataTestId("home-link").click();

    cy.get(".card-panel").first().click();

    cy.get(".feed-item-page-container").should("be.visible");

    const toggleButton = cy.get(".toggle-btn");

    toggleButton.should("have.text", "Mark as read");

    cy.intercept(baseUrl + "/item.json").as("itemUpdateRequest");
    cy.wait(2000);
    toggleButton.click();
    cy.wait("@itemUpdateRequest");

    toggleButton.should("not.be.disabled");
    toggleButton.should("have.text", "Mark as unread");

    //TODO: test the audio player?

    cy.markAllAsUnread();
    cy.unsubscribe("Up First");
  });

  it("should handle youtube channels", () => {
    cy.subscribe("https://www.youtube.com/c/ContinuousDelivery");

    cy.getByDataTestId("home-link").click();

    cy.get(".card-panel").first().click();

    cy.get(".video-container").should("be.visible");

    const toggleButton = cy.get(".toggle-btn");

    toggleButton.should("have.text", "Mark as read");

    cy.intercept(baseUrl + "/item.json").as("itemUpdateRequest");
    cy.wait(2000);
    toggleButton.click();
    cy.wait("@itemUpdateRequest");

    toggleButton.should("not.be.disabled");
    toggleButton.should("have.text", "Mark as unread");

    //TODO: test the video player?

    cy.markAllAsUnread();
    cy.unsubscribe("Continuous Delivery");
  });
});
