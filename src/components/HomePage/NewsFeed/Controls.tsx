import type { FeedItem } from "utils/types";
import type { FeedControls, FetchFeed, FeedFilters } from "utils/hooks/useFeed";

interface Props {
  feed: FeedItem[];
  controls: FeedControls;
  filters: FeedFilters;
  fetchFeed: FetchFeed;
  token: string;
}

export const Controls = ({
  feed,
  controls,
  filters,
  fetchFeed,
  token,
}: Props) => {
  const mobileFilterClassName = `btn mobile-filter ${
    filters.shouldFilterUnread ? "mobile-filtered" : "mobile-unfiltered"
  }`;

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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.status !== 200) {
        // TODO: handle error
        return;
      }

      await fetchFeed(token);
    } catch {
      // TODO: handle error
    } finally {
      controls.setIsUpdatingItem(false);
      controls.setAllItemsChecked(false);
      controls.setCheckedItemIds(new Set());
    }
  };

  return (
    <div className="controls">
      <div className="status-controls">
        {!!feed.length && (
          <label>
            <input
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
          onChange={(e) => {
            filters.setShouldFilterUnread(e.target.checked);
          }}
        />
        <span>Filter by unread</span>
      </label>

      <label className={mobileFilterClassName}>
        <input
          type="checkbox"
          className="visually-hidden"
          checked={filters.shouldFilterUnread}
          onChange={(e) => {
            filters.setShouldFilterUnread(e.target.checked);
          }}
        />
        <span className="visually-hidden">Filter by unread</span>
        <i className="material-icons">filter_list</i>
      </label>
    </div>
  );
};
