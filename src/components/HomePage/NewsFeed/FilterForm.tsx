import { useRef } from "react";
import type { FeedFilters } from "utils/hooks/useFeed";

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

export const FilterForm = ({ filters }: Props) => {
  return (
    <form className="filter-form">
      <Toggles filters={filters} />
      <SearchInput filters={filters} />
    </form>
  );
};
