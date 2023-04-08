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
}

export const NewsFeed = ({ initialFeed, initialFeedError }: Props) => {
  const { filteredFeed, filters, controls, fetchFeed, feedError } = useFeed({
    initialFeed: initialFeed ?? [],
  });

  useEffect(() => {
    // Gets latest feed on browser back nav
    fetchFeed();
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
    return <h2>{error}</h2>;
  }

  return (
    <>
      <FilterForm filters={filters} />

      <Controls
        feed={filteredFeed}
        controls={controls}
        filters={filters}
        fetchFeed={fetchFeed}
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
