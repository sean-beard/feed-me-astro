import { useEffect, useMemo } from "react";
import { useFeed } from "utils/hooks/useFeed";
import { FeedItem } from "./FeedItem";
import { FilterForm } from "./FilterForm";
import { Controls } from "./Controls";
import type { Feed } from "utils/types";

import "./styles.css";

interface Props {
  initialFeedError: string;
  initialFeed?: Feed;
  token: string;
}

export const NewsFeed = ({ initialFeed, initialFeedError, token }: Props) => {
  const { filteredFeed, filters, controls, fetchFeed, feedError } = useFeed({
    initialFeed: initialFeed ?? [],
  });

  useEffect(() => {
    // Gets latest feed on browser back nav
    fetchFeed(token);
  }, []);

  if (!initialFeed?.length) {
    return null;
  }

  const hasNoUnreadItems = useMemo(
    () => !!filteredFeed && !filteredFeed.length,
    [filteredFeed]
  );

  const error = initialFeedError || feedError;

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <FilterForm filters={filters} />

      <Controls
        feed={filteredFeed}
        controls={controls}
        filters={filters}
        fetchFeed={fetchFeed}
        token={token}
      />

      {hasNoUnreadItems && <h2>Nothing to see here!</h2>}

      {!!filteredFeed.length && (
        <>
          {filteredFeed.map((feedItem) => (
            <FeedItem
              key={feedItem.id}
              feedItem={feedItem}
              isChecked={controls.checkedItemIds.has(feedItem.id)}
              onChange={(e) => {
                let newSet = new Set(controls.checkedItemIds);

                if (e.target.checked) {
                  newSet.add(feedItem.id);
                } else {
                  newSet.delete(feedItem.id);
                }

                controls.setCheckedItemIds(newSet);
              }}
            />
          ))}
        </>
      )}
    </>
  );
};
