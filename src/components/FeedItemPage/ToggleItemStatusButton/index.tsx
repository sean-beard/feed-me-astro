import { useState } from "react";
import type { FeedItem } from "utils/types";

import "./styles.css";

interface Props {
  feedItem: FeedItem;
}

export const ToggleItemStatusButton = ({ feedItem }: Props) => {
  const [isRead, setIsRead] = useState(feedItem.isRead);
  const [isLoading, setIsLoading] = useState(false);

  const toggleStatus = async () => {
    const newIsReadStatus = !isRead;

    setIsLoading(true);

    try {
      const data = await fetch("/item.json", {
        method: "PUT",
        body: JSON.stringify({
          items: [{ id: feedItem.id, isRead: newIsReadStatus }],
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (data.status !== 200) {
        // TODO: handle error
        return;
      }

      setIsRead(newIsReadStatus);
    } catch {
      // TODO: handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="btn toggle-btn"
      disabled={isLoading}
      onClick={toggleStatus}
    >
      {isRead ? "Mark as unread" : "Mark as read"}
    </button>
  );
};
