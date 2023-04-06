import type { FeedItem } from "utils/types";

interface FeedItemCardProps {
  item: FeedItem;
}

export const FeedItemCard = ({ item }: FeedItemCardProps) => {
  const className = item.isRead ? "card-panel" : "card-panel unread";

  return (
    <a className="card-link" href={`/item/${item.id}`}>
      <div className={className}>
        <p>{item.title}</p>
        <p>{item.feedName}</p>
      </div>
    </a>
  );
};
