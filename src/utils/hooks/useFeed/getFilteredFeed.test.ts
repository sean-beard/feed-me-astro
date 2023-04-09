import { describe, expect, test } from "vitest";
import { getFilteredFeed } from "./getFilteredFeed";
import type { FeedFilters } from ".";

describe(getFilteredFeed.name, () => {
  test("handles when there is no feed", () => {
    const mockFilters = {
      showArticles: false,
      showPodcasts: false,
      showYoutube: false,
      shouldFilterUnread: false,
    } as FeedFilters;

    const filteredFeed = getFilteredFeed(null, mockFilters);

    expect(filteredFeed).toEqual([]);
  });
});
