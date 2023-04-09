import { useEffect, useMemo, useState } from "react";
import { useControls } from "./useControls";
import { useFilters } from "./useFilters";
import type { Feed, GetFeedResponse } from "utils/types";
import { get } from "utils/api";

export interface FeedControls {
  allItemsChecked: boolean;
  setAllItemsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  checkedItemIds: Set<number>;
  setCheckedItemIds: React.Dispatch<React.SetStateAction<Set<number>>>;
  isUpdatingItem: boolean;
  setIsUpdatingItem: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FeedFilters {
  showArticles: boolean;
  setShowArticles: (value: boolean) => void;
  showPodcasts: boolean;
  setShowPodcasts: (value: boolean) => void;
  showYoutube: boolean;
  setShowYoutube: (value: boolean) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  shouldFilterUnread: boolean;
  setShouldFilterUnread: (value: boolean) => void;
}

export type FetchFeed = () => Promise<void>;

const FEED_ERROR_MESSAGE =
  "Oops! There was an error loading your feed. Please try again later.";

const getCachedFeed = (): Feed | null => {
  const cachedFeed = localStorage.getItem("feed");

  if (!cachedFeed) {
    return null;
  }

  return JSON.parse(cachedFeed);
};

const setCachedFeed = (feed: Feed) => {
  localStorage.setItem("feed", JSON.stringify(feed.slice(0, 350)));
};

const getFilteredFeed = (feed: Feed | null, filters: FeedFilters): Feed => {
  return (feed || [])
    .filter((item) => {
      const isPodcast = item.mediaType === "audio/mpeg";
      const isYoutubeVideo = item.url.indexOf("youtube.com") > 0;
      const isArticle = !isPodcast && !isYoutubeVideo;

      if (filters.showArticles && filters.showPodcasts && filters.showYoutube)
        return true;
      if (filters.showPodcasts && filters.showYoutube)
        return isPodcast || isYoutubeVideo;
      if (filters.showArticles && filters.showYoutube)
        return isArticle || isYoutubeVideo;
      if (filters.showArticles && filters.showPodcasts)
        return isArticle || isPodcast;
      if (filters.showPodcasts) return isPodcast;
      if (filters.showYoutube) return isYoutubeVideo;
      if (filters.showArticles) return isArticle;
    })
    .filter((item) => {
      const searchCriteria =
        item.title.toLowerCase().indexOf(filters.searchTerm) > -1 ||
        item.feedName.toLowerCase().indexOf(filters.searchTerm) > -1 ||
        (item.description || "").toLowerCase().indexOf(filters.searchTerm) > -1;

      if (filters.shouldFilterUnread) {
        return !item.isRead && searchCriteria;
      }

      return searchCriteria;
    });
};

interface Props {
  token: string;
}

export const useFeed = ({ token }: Props) => {
  const filters = useFilters();
  const [feed, setFeed] = useState<Feed | null>(null);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState("");

  const filteredFeed = getFilteredFeed(feed, filters);
  const controls = useControls(filteredFeed);

  const fetchFeed = async () => {
    setFeedError("");
    setFeedLoading(true);

    try {
      const data = await get<GetFeedResponse>({ path: "/feed", token });

      if (data.status !== 200) {
        setFeedError(FEED_ERROR_MESSAGE);
      }

      setFeed(data.feed);
      setCachedFeed(data.feed);
    } catch {
      setFeedError(FEED_ERROR_MESSAGE);
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    const cachedFeed = getCachedFeed();

    if (cachedFeed) {
      setFeed(cachedFeed);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, []);

  return {
    feed,
    feedLoading,
    feedError,
    filteredFeed,
    filters,
    controls,
    fetchFeed,
  };
};
