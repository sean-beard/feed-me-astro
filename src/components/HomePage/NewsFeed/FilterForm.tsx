import { useRef } from "react";
import type { FeedFilters } from "utils/hooks/useFeed";
import type { FeedItem } from "utils/types";

interface Props {
  filters: FeedFilters;
}

const Toggles = ({ filters }: Props) => {
  return (
    <div className="toggles">
      <label>
        <input
          type="checkbox"
          checked={filters.showArticles}
          onChange={(e) => {
            filters.setShowArticles(e.target.checked);
          }}
        />
        <span>Articles</span>
      </label>

      <label>
        <input
          type="checkbox"
          checked={filters.showPodcasts}
          onChange={(e) => {
            filters.setShowPodcasts(e.target.checked);
          }}
        />
        <span>Podcasts</span>
      </label>

      <label>
        <input
          type="checkbox"
          checked={filters.showYoutube}
          onChange={(e) => {
            filters.setShowYoutube(e.target.checked);
          }}
        />
        <span>YouTube</span>
      </label>
    </div>
  );
};

const SearchInput = ({ filters }: Props) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const hasFocus = document.activeElement === searchInputRef?.current;
  const shouldRaiseLabel = !!filters.searchTerm || hasFocus;

  return (
    <div className="input-field">
      <input
        ref={searchInputRef}
        id="search"
        type="search"
        name="search"
        value={filters.searchTerm}
        onChange={(e) => {
          filters.setSearchTerm(e.target.value);
        }}
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

    if (!formRef.current) {
      return;
    }

    setFeedLoading(true);

    const formData = new FormData(formRef.current);
    const searchTerm = formData.get("search");

    try {
      const response = await fetch("feed.json", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ searchTerm }),
      });

      const searchResults = await response.json();

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
      <SearchInput filters={filters} />
    </form>
  );
};
