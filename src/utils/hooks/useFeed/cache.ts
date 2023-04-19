import type { Feed } from "utils/types";

export const getCachedFeed = (): Feed | null => {
  const cachedFeed = localStorage.getItem("feed");

  if (!cachedFeed) {
    return null;
  }

  return JSON.parse(cachedFeed);
};

export const setCachedFeed = (feed: Feed) => {
  localStorage.setItem("feed", JSON.stringify(feed.slice(0, 350)));
};
