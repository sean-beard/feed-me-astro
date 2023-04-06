import { useEffect, useState } from "react";
import type { Feed } from "utils/types";

export const useControls = (feed: Feed) => {
  const [allItemsChecked, setAllItemsChecked] = useState(false);
  const [checkedItemIds, setCheckedItemIds] = useState<Set<number>>(new Set());
  const [isUpdatingItem, setIsUpdatingItem] = useState(false);

  useEffect(() => {
    if (allItemsChecked) {
      const ids = feed.map((item) => item.id);

      setCheckedItemIds(new Set(ids));
    }

    if (!allItemsChecked) {
      setCheckedItemIds(new Set());
    }
  }, [allItemsChecked, setCheckedItemIds, feed]);

  return {
    allItemsChecked,
    setAllItemsChecked,
    checkedItemIds,
    setCheckedItemIds,
    isUpdatingItem,
    setIsUpdatingItem,
  };
};
