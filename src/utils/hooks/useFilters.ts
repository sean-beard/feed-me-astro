import { useEffect, useState } from "react";

interface Filters {
  showArticles: boolean;
  showPodcasts: boolean;
  showYoutube: boolean;
  searchTerm: string;
  shouldFilterUnread: boolean;
}

const getCachedFilters = (): Filters | null => {
  const cachedFiltersString = localStorage.getItem("filters");

  if (!cachedFiltersString) {
    return null;
  }

  return JSON.parse(cachedFiltersString);
};

const setCachedFilters = (filters: Filters) => {
  localStorage.setItem("filters", JSON.stringify(filters));
};

const setCachedFilter = (filterKey: string, value: boolean | string) => {
  const cachedFilters = getCachedFilters();

  const newCachedFilters = { ...cachedFilters, [filterKey]: value };

  localStorage.setItem("filters", JSON.stringify(newCachedFilters));
};

export const useFilters = () => {
  const cachedFilters = getCachedFilters();

  const [showArticles, setShowArticlesState] = useState(
    cachedFilters?.showArticles ?? true
  );
  const [showPodcasts, setShowPodcastsState] = useState(
    cachedFilters?.showPodcasts ?? true
  );
  const [showYoutube, setShowYoutubeState] = useState(
    cachedFilters?.showYoutube ?? true
  );
  const [searchTerm, setSearchTermState] = useState(
    cachedFilters?.searchTerm ?? ""
  );
  const [shouldFilterUnread, setShouldFilterUnreadState] = useState(
    cachedFilters?.shouldFilterUnread ?? true
  );

  useEffect(() => {
    if (!cachedFilters) {
      setCachedFilters({
        showArticles,
        showPodcasts,
        showYoutube,
        searchTerm,
        shouldFilterUnread,
      });
    }
  }, []);

  const setShowArticles = (value: boolean) => {
    setShowArticlesState(value);
    setCachedFilter("showArticles", value);
  };

  const setShowPodcasts = (value: boolean) => {
    setShowPodcastsState(value);
    setCachedFilter("showPodcasts", value);
  };

  const setShowYoutube = (value: boolean) => {
    setShowYoutubeState(value);
    setCachedFilter("showYoutube", value);
  };

  const setSearchTerm = (value: string) => {
    setSearchTermState(value);
    setCachedFilter("searchTerm", value);
  };

  const setShouldFilterUnread = (value: boolean) => {
    setShouldFilterUnreadState(value);
    setCachedFilter("shouldFilterUnread", value);
  };

  return {
    showArticles,
    setShowArticles,
    showPodcasts,
    setShowPodcasts,
    showYoutube,
    setShowYoutube,
    searchTerm,
    setSearchTerm,
    shouldFilterUnread,
    setShouldFilterUnread,
  };
};
