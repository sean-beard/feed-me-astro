import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    env: {
      apiBaseUrl: "http://0.0.0.0:4000",
      // apiBaseUrl: "http://localhost:4000",
    },
    baseUrl: "http://localhost:8080",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
