import { useMemo, useState } from "react";
import { useControls } from "./useControls";
import { useFilters } from "./useFilters";
import type { Feed } from "utils/types";

export type FeedControls = ReturnType<typeof useFeed>["controls"];
export type FeedFilters = ReturnType<typeof useFeed>["filters"];
export type FetchFeed = ReturnType<typeof useFeed>["fetchFeed"];

interface Props {
  initialFeed: Feed;
}

export const useFeed = ({ initialFeed }: Props) => {
  const filters = useFilters();
  const [feed, setFeed] = useState<Feed>(initialFeed);
  const [feedError, setFeedError] = useState("");

  const filteredFeed = useMemo(() => {
    return feed
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

    try {
      const response = await fetch("/feed.json", {
        headers: { "Content-Type": "application/json" },
      });

      const feed = await response.json();

      setFeed(feed);
    } catch {
      setFeedError(
        "Oops! There was an error loading your feed. Please try again later."
      );
    }
  };

  return {
    filteredFeed,
    fetchFeed,
    feedError,
    filters,
    controls,
  };
};
