import { ChangeEvent, useState } from "react";
import type { FeedItem } from "utils/types";
import type { FeedControls, FetchFeed, FeedFilters } from "utils/hooks/useFeed";

interface Props {
  feed: FeedItem[];
  controls: FeedControls;
  filters: FeedFilters;
  feedLoading: boolean;
  fetchFeed: FetchFeed;
}

export const Controls = ({
  feed,
  controls,
  filters,
  feedLoading,
  fetchFeed,
}: Props) => {
  const [mobileFilterClassName, setMobileFilterClassName] = useState(
    filters.shouldFilterUnread ? "mobile-filtered" : "mobile-unfiltered",
  );

  const shouldRenderGlobalCheckbox =
    (!!feed.length && !feedLoading) || controls.isUpdatingItem;

  const handleMarkAll = async (status: "read" | "unread") => {
    const payload: { id: number; isRead: boolean }[] = [];

    controls.checkedItemIds.forEach((id) => {
      payload.push({ id: id, isRead: status === "read" });
    });

    controls.setIsUpdatingItem(true);

    try {
      const data = await fetch("/item.json", {
        method: "PUT",
        body: JSON.stringify({ items: payload }),
        headers: { "Content-Type": "application/json" },
      });

      if (data.status !== 200) {
        // TODO: handle error
        return;
      }
    } catch {
      // TODO: handle error
    } finally {
    }

    await fetchFeed();
    controls.setIsUpdatingItem(false);
    controls.setAllItemsChecked(false);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    filters.setShouldFilterUnread(isChecked);

    setMobileFilterClassName(
      isChecked ? "mobile-filtered" : "mobile-unfiltered",
    );
  };

  return (
    <div className="controls">
      <div className="status-controls">
        {shouldRenderGlobalCheckbox && (
          <label>
            <input
              data-test-id="toggle-select-all"
              type="checkbox"
              checked={controls.allItemsChecked}
              onChange={(e) => {
                controls.setAllItemsChecked(e.target.checked);
              }}
            />
            <span className="visually-hidden">Select all items</span>
          </label>
        )}

        {!!controls.checkedItemIds.size && (
          <div className="btn-wrapper">
            <button
              type="button"
              className="btn control-button"
              disabled={controls.isUpdatingItem}
              onClick={(e) => {
                e.preventDefault();
                handleMarkAll("read");
              }}
            >
              Mark as Read
            </button>
            <button
              type="button"
              className="btn control-button"
              disabled={controls.isUpdatingItem}
              onClick={() => {
                handleMarkAll("unread");
              }}
            >
              Mark as Unread
            </button>
          </div>
        )}
      </div>

      <label className="desktop-filter">
        <input
          type="checkbox"
          checked={filters.shouldFilterUnread}
          onChange={handleFilterChange}
        />
        <span>Filter by unread</span>
      </label>

      <label className={`btn mobile-filter ${mobileFilterClassName}`}>
        <input
          type="checkbox"
          className="visually-hidden"
          checked={filters.shouldFilterUnread}
          onChange={handleFilterChange}
        />
        <span className="visually-hidden">Filter by unread</span>
        <i className="material-icons">filter_list</i>
      </label>
    </div>
  );
};
