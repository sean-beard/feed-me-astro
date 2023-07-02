import { useRef } from "react";
import type { FeedFilters } from "utils/hooks/useFeed";
import type { FeedItem } from "utils/types";
import { SearchInput } from "./SearchInput";
import { search } from "./search";
import { Toggles } from "./Toggles";

interface FilterFormProps {
  filters: FeedFilters;
  appendToFeed: (searchResults: FeedItem[]) => void;
  setFeedLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FilterForm = ({
  filters,
  appendToFeed,
  setFeedLoading,
}: FilterFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = formRef.current;

    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const searchTerm = formData.get("search")?.toString();

    if (!searchTerm) {
      return;
    }

    setFeedLoading(true);

    try {
      const searchResults = await search(searchTerm);

      appendToFeed(searchResults);
    } catch {
      // TODO: handle error
    } finally {
      setFeedLoading(false);
    }
  };

  return (
    <form ref={formRef} className="filter-form" onSubmit={handleSearchSubmit}>
      <Toggles filters={filters} />
      <SearchInput filters={filters} appendToFeed={appendToFeed} />
    </form>
  );
};
