/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getByDataTestId(id: string): Chainable<JQuery<HTMLElement>>;
    subscribe(feedUrl: string): void;
    unsubscribe(feedName: string): void;
    markAllAsUnread(): void;
  }
}
