import { beforeEach, describe, expect, it } from "vitest";
import type { Feed } from "utils/types";
import { getCachedFeed, setCachedFeed } from "./cache";

describe("Feed cache", () => {
  const mockFeed: Feed = [
    {
      id: 1,
      feedName: "Article Feed",
      title: "Article Title",
      description: "Article description",
      url: "https://article.com",
      pubDate: "",
      isRead: false,
      currentTime: null,
      mediaType: null,
      mediaUrl: null,
    },
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  it("handles getting an empty cache", () => {
    const cache = getCachedFeed();

    expect(cache).toEqual(null);
  });

  it("handles getting the cache", () => {
    localStorage.setItem("feed", JSON.stringify(mockFeed));

    const cache = getCachedFeed();

    expect(cache).toEqual(mockFeed);
  });

  it("handles setting the cache", () => {
    setCachedFeed(mockFeed);

    const cache = getCachedFeed();

    expect(cache).toEqual(mockFeed);
  });
});
