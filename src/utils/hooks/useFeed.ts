import { useEffect, useMemo, useState } from "react";
import { useControls } from "./useControls";
import { useFilters } from "./useFilters";
import type { Feed, GetFeedResponse } from "utils/types";
import { get } from "utils/api";

export type FeedControls = ReturnType<typeof useFeed>["controls"];
export type FeedFilters = ReturnType<typeof useFeed>["filters"];
export type FetchFeed = ReturnType<typeof useFeed>["fetchFeed"];

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

interface Props {
  token: string;
}

export const useFeed = ({ token }: Props) => {
  const cachedFeed = getCachedFeed();
  const filters = useFilters();
  const [feed, setFeed] = useState<Feed | null>(cachedFeed);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState("");

  const filteredFeed = useMemo(() => {
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
          (item.description || "").toLowerCase().indexOf(filters.searchTerm) >
            -1;

        if (filters.shouldFilterUnread) {
          return !item.isRead && searchCriteria;
        }

        return searchCriteria;
      });
  }, [
    feed,
    filters.showArticles,
    filters.showPodcasts,
    filters.showYoutube,
    filters.searchTerm,
    filters.shouldFilterUnread,
  ]);

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
