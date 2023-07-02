import type { FeedItem } from "utils/types";

export const search = async (searchTerm: string): Promise<FeedItem[]> => {
  const response = await fetch("feed.json", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ searchTerm }),
  });

  return response.json();
};
