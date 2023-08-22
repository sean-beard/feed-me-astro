import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { Feed, FeedItem } from "utils/types";
import { FeedControls, FeedFilters, useFeed } from ".";
import * as cacheUtils from "./cache";
import * as apiUtils from "utils/api";
import * as useControlsHook from "../useControls";
import * as useFiltersHook from "../useFilters";

describe(useFeed.name, () => {
  const mockArticleFeedItem: FeedItem = {
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
  };

  const mockPodcastFeedItem: FeedItem = {
    id: 2,
    feedName: "Podcast Feed",
    title: "Podcast Title",
    description: "Podcast description",
    url: "https://podcast.com",
    pubDate: "",
    isRead: false,
    currentTime: null,
    mediaType: "audio/mpeg",
    mediaUrl: "https://podcast.com/123",
  };

  const mockYoutubeFeedItem: FeedItem = {
    id: 1,
    feedName: "Youtube Channel",
    title: "Youtube Video Title",
    description: "Video description",
    url: "https://youtube.com?v=1234",
    pubDate: "",
    isRead: false,
    currentTime: null,
    mediaType: null,
    mediaUrl: null,
  };

  const mockFeed: Feed = [
    mockArticleFeedItem,
    mockPodcastFeedItem,
    mockYoutubeFeedItem,
  ];

  const mockControls: FeedControls = {
    allItemsChecked: false,
    setAllItemsChecked: vi.fn(),
    checkedItemIds: new Set(),
    setCheckedItemIds: vi.fn(),
    isUpdatingItem: false,
    setIsUpdatingItem: vi.fn(),
  };

  const mockFilters: FeedFilters = {
    showArticles: false,
    setShowArticles: vi.fn(),
    showPodcasts: false,
    setShowPodcasts: vi.fn(),
    showYoutube: false,
    setShowYoutube: vi.fn(),
    searchTerm: "",
    setSearchTerm: vi.fn(),
    shouldFilterUnread: false,
    setShouldFilterUnread: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(apiUtils, "get").mockResolvedValue({
      status: 200,
      feed: mockFeed,
    });

    vi.spyOn(useControlsHook, "useControls").mockReturnValue(mockControls);
    vi.spyOn(useFiltersHook, "useFilters").mockReturnValue(mockFilters);
  });

  it("should handle successfully fetching the feed", async () => {
    const { result } = renderHook(() => useFeed({ token: "foo" }));

    await waitFor(() => expect(result.current.feed).toEqual(mockFeed));
  });

  it("should handle when the feed is loading", () => {
    const { result } = renderHook(() => useFeed({ token: "foo" }));

    expect(result.current.feedLoading).toEqual(true);
  });

  it("should handle when fetching the feed fails", async () => {
    vi.spyOn(apiUtils, "get").mockResolvedValue({ status: 500 });

    const { result } = renderHook(() => useFeed({ token: "foo" }));

    await waitFor(() =>
      expect(result.current.feedError).toEqual(
        "Oops! There was an error loading your feed. Please try again later.",
      ),
    );
  });

  it("should handle caching the feed", async () => {
    const { result } = renderHook(() => useFeed({ token: "foo" }));

    await waitFor(() => expect(result.current.feed).toEqual(mockFeed));

    const cachedFeed = cacheUtils.getCachedFeed();

    expect(cachedFeed).toEqual(mockFeed);
  });
});
