import type { FeedItem } from "utils/types";
import type { useFeed } from "utils/hooks/useFeed";
import { getClientAuthToken } from "utils/getClientAuthToken";

interface Props {
  feed: FeedItem[];
  controls: ReturnType<typeof useFeed>["controls"];
  filters: ReturnType<typeof useFeed>["filters"];
  fetchFeed: ReturnType<typeof useFeed>["fetchFeed"];
}

export const Controls = ({ feed, controls, filters, fetchFeed }: Props) => {
  const mobileFilterClassName = `btn mobile-filter ${
    filters.shouldFilterUnread ? "mobile-filtered" : "mobile-unfiltered"
  }`;

  const handleMarkAll = async (status: "read" | "unread") => {
    const payload: { id: number; isRead: boolean }[] = [];

    controls.checkedItemIds.forEach((id) => {
      payload.push({ id: id, isRead: status === "read" });
    });

    controls.setIsUpdatingItem(true);

    const token = getClientAuthToken();

    if (!token) {
      return;
    }

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

      await fetchFeed();
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
