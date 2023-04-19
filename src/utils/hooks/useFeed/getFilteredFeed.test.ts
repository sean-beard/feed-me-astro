import { describe, expect, it } from "vitest";
import { getFilteredFeed } from "./getFilteredFeed";
import type { FeedFilters } from ".";
import type { Feed, FeedItem } from "utils/types";

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

describe(getFilteredFeed.name, () => {
  const baseMockFilters = {
    showArticles: false,
    showPodcasts: false,
    showYoutube: false,
    shouldFilterUnread: false,
    searchTerm: "",
  } as FeedFilters;

  it("handles when there is no feed", () => {
    const mockFilters = baseMockFilters;

    const filteredFeed = getFilteredFeed(null, mockFilters);

    expect(filteredFeed).toEqual([]);
  });

  it("handles when articles should show", () => {
    const mockFilters = { ...baseMockFilters, showArticles: true };

    const filteredFeed = getFilteredFeed(mockFeed, mockFilters);

    expect(filteredFeed).toEqual([mockArticleFeedItem]);
  });

  it("handles when podcasts should show", () => {
    const mockFilters = { ...baseMockFilters, showPodcasts: true };

    const filteredFeed = getFilteredFeed(mockFeed, mockFilters);

    expect(filteredFeed).toEqual([mockPodcastFeedItem]);
  });

  it("handles when youtube videos should show", () => {
    const mockFilters = { ...baseMockFilters, showYoutube: true };

    const filteredFeed = getFilteredFeed(mockFeed, mockFilters);

    expect(filteredFeed).toEqual([mockYoutubeFeedItem]);
  });

  it("handles when articles and podcasts should show", () => {
    const mockFilters = {
      ...baseMockFilters,
      showArticles: true,
      showPodcasts: true,
    };

    const filteredFeed = getFilteredFeed(mockFeed, mockFilters);

    expect(filteredFeed).toEqual([mockArticleFeedItem, mockPodcastFeedItem]);
  });

  it("handles when podcasts and youtube videos should show", () => {
    const mockFilters = {
      ...baseMockFilters,
      showPodcasts: true,
      showYoutube: true,
    };

    const filteredFeed = getFilteredFeed(mockFeed, mockFilters);

    expect(filteredFeed).toEqual([mockPodcastFeedItem, mockYoutubeFeedItem]);
  });

  it("handles when articles and youtube videos should show", () => {
    const mockFilters = {
      ...baseMockFilters,
      showArticles: true,
      showYoutube: true,
    };

    const filteredFeed = getFilteredFeed(mockFeed, mockFilters);

    expect(filteredFeed).toEqual([mockArticleFeedItem, mockYoutubeFeedItem]);
  });

  it("handles when all item types should show", () => {
    const mockFilters = {
      ...baseMockFilters,
      showArticles: true,
      showPodcasts: true,
      showYoutube: true,
    };

    const filteredFeed = getFilteredFeed(mockFeed, mockFilters);

    expect(filteredFeed).toEqual(mockFeed);
  });

  it("handles when no item types should show", () => {
    const mockFilters = baseMockFilters;

    const filteredFeed = getFilteredFeed(mockFeed, mockFilters);

    expect(filteredFeed).toEqual([]);
  });
});
