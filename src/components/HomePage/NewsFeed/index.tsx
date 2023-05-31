import { AnimatePresence, motion } from "framer-motion";
import type { FeedControls, FeedFilters, FetchFeed } from "utils/hooks/useFeed";
import type { Feed, FeedItem as FeedItemType } from "utils/types";
import { FeedItem } from "./FeedItem";
import { FilterForm } from "./FilterForm";
import { FeedItemsSkeleton } from "./FeedSkeleton";
import { Controls } from "./Controls";

import "./styles.css";

interface Props {
  filteredFeed: Feed;
  feedLoading: boolean;
  feedError: string;
  filters: FeedFilters;
  controls: FeedControls;
  appendToFeed: (searchResults: FeedItemType[]) => void;
  fetchFeed: FetchFeed;
  setFeedLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NewsFeed = ({
  filteredFeed,
  feedLoading,
  feedError,
  filters,
  controls,
  appendToFeed,
  fetchFeed,
  setFeedLoading,
}: Props) => {
  const hasNoUnreadItems = !!filteredFeed && !filteredFeed.length;

  if (feedError) {
    return <h2>{feedError}</h2>;
  }

  const feedLoadingWhenCaughtUp = hasNoUnreadItems && feedLoading;

  return (
    <div data-test-id="newsfeed">
      <FilterForm
        filters={filters}
        appendToFeed={appendToFeed}
        setFeedLoading={setFeedLoading}
      />

      <Controls
        feed={filteredFeed}
        controls={controls}
        filters={filters}
        feedLoading={feedLoading}
        fetchFeed={fetchFeed}
      />

      {hasNoUnreadItems && !feedLoading && <h2>Nothing to see here!</h2>}

      {feedLoadingWhenCaughtUp && <FeedItemsSkeleton />}

      {!!filteredFeed.length && (
        <AnimatePresence>
          {filteredFeed.map((feedItem) => (
            <motion.div
              key={feedItem.id}
              className="scroll-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FeedItem
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
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};
