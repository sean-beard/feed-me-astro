import { useMemo, useRef } from "react";
import type { FeedFilters } from "utils/hooks/useFeed";
import type { FeedItem } from "utils/types";
import { debounce } from "./debounce";
import { search } from "./search";

interface SearchInputProps {
  filters: FeedFilters;
  appendToFeed: (searchResults: FeedItem[]) => void;
}

export const SearchInput = ({ filters, appendToFeed }: SearchInputProps) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const hasFocus = document.activeElement === searchInputRef?.current;
  const shouldRaiseLabel = !!filters.searchTerm || hasFocus;

  const debouncedSearch = useMemo(() => debounce(search, 1000), []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    filters.setSearchTerm(e.target.value);

    const form = searchInputRef.current?.form;

    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const searchTerm = formData.get("search")?.toString()?.trim();

    if (!searchTerm) {
      return;
    }

    const searchResults = await debouncedSearch(searchTerm);

    if (searchResults && searchResults.length > 0) {
      appendToFeed(searchResults);
    }
  };

  return (
    <div className="input-field">
      <input
        ref={searchInputRef}
        id="search"
        type="search"
        name="search"
        value={filters.searchTerm}
        onChange={handleSearchChange}
      />

      <label htmlFor="search" className={shouldRaiseLabel ? "active" : ""}>
        Search {filters.shouldFilterUnread ? "unread" : "all"}
      </label>

      {!!filters.searchTerm.length && (
        <button
          className="clear-search-btn"
          type="button"
          onClick={() => {
            filters.setSearchTerm("");

            if (searchInputRef?.current) {
              searchInputRef.current.focus();
            }
          }}
        >
          <span className="visually-hidden">Clear search text</span>
          <i className="material-icons">clear</i>
        </button>
      )}
    </div>
  );
};
