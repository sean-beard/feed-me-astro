import type { FeedControls, FeedFilters, FetchFeed } from "utils/hooks/useFeed";
import type { Feed } from "utils/types";
import { FeedItem } from "./FeedItem";
import { FilterForm } from "./FilterForm";
import { Controls } from "./Controls";

import "./styles.css";

interface Props {
  filteredFeed: Feed;
  feedLoading: boolean;
  feedError: string;
  filters: FeedFilters;
  controls: FeedControls;
  fetchFeed: FetchFeed;
}

export const NewsFeed = ({
  filteredFeed,
  feedLoading,
  feedError,
  filters,
  controls,
  fetchFeed,
}: Props) => {
  const hasNoUnreadItems = !!filteredFeed && !filteredFeed.length;

  if (feedError) {
    return <h2>{feedError}</h2>;
  }

  return (
    <>
      <FilterForm filters={filters} />

      <Controls
        feed={filteredFeed}
        controls={controls}
        filters={filters}
        feedLoading={feedLoading}
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
