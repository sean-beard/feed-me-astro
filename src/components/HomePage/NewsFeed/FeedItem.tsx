import type { ChangeEventHandler } from "react";
import type { FeedItem as FeedItemType } from "utils/types";
import { FeedItemCard } from "./FeedItemCard";

interface FeedItemProps {
  feedItem: FeedItemType;
  isChecked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const FeedItem = ({ feedItem, isChecked, onChange }: FeedItemProps) => {
  return (
    <div id={feedItem.id.toString()} className="feed-row">
      <label>
        <input
          type="checkbox"
          value={feedItem.id}
          checked={isChecked}
          onChange={onChange}
        />
        <span className="visually-hidden">{feedItem.title}</span>
      </label>
      <FeedItemCard item={feedItem} />
    </div>
  );
};
