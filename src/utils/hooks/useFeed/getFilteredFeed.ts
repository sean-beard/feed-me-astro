import type { Feed, FeedItem } from "utils/types";
import type { FeedFilters } from ".";
import { getCachedFeed } from "./cache";

const matchesFilteredItemType = (
  item: FeedItem,
  { showArticles, showPodcasts, showYoutube }: FeedFilters
): boolean => {
  const isPodcast = item.mediaType === "audio/mpeg";
  const isYoutubeVideo = item.url.indexOf("youtube.com") > 0;
  const isArticle = !isPodcast && !isYoutubeVideo;

  if (showArticles && showPodcasts && showYoutube) return true;
  if (showPodcasts && showYoutube) return isPodcast || isYoutubeVideo;
  if (showArticles && showYoutube) return isArticle || isYoutubeVideo;
  if (showArticles && showPodcasts) return isArticle || isPodcast;
  if (showPodcasts) return isPodcast;
  if (showYoutube) return isYoutubeVideo;
  if (showArticles) return isArticle;

  return false;
};

const matchesSearchTerm = (item: FeedItem, filters: FeedFilters): boolean => {
  const matchesSearchCriteria =
    item.title.toLowerCase().indexOf(filters.searchTerm.toLowerCase()) > -1 ||
    item.feedName.toLowerCase().indexOf(filters.searchTerm.toLowerCase()) >
      -1 ||
    (item.description || "")
      .toLowerCase()
      .indexOf(filters.searchTerm.toLowerCase()) > -1;

  if (filters.shouldFilterUnread) {
    return !item.isRead && matchesSearchCriteria;
  }

  return matchesSearchCriteria;
};

export const getFilteredFeed = (
  feed: Feed | null,
  filters: FeedFilters
): Feed => {
  const cachedFeed = getCachedFeed();

  return (feed || cachedFeed || []).filter((item) => {
    return (
      matchesFilteredItemType(item, filters) && matchesSearchTerm(item, filters)
    );
  });
};
