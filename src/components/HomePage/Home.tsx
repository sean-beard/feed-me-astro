import { NewsFeed } from "./NewsFeed";
import { FeedSkeleton } from "./NewsFeed/FeedSkeleton";
import { useFeed } from "utils/hooks/useFeed";

interface Props {
  token: string;
}

export const Home = ({ token }: Props) => {
  const {
    feed,
    feedLoading,
    feedError,
    filteredFeed,
    controls,
    filters,
    appendToFeed,
    fetchFeed,
    setFeedLoading,
  } = useFeed({ token });

  const shouldRenderFeed = !!feed?.length && feed.length > 0 && !feedError;
  const userHasNoSubscriptions =
    feed && !feed?.length && !feedLoading && !feedError;

  return (
    <section data-test-id="home" style={{ textAlign: "center" }}>
      {feedError && <h2>{feedError}</h2>}
      {!shouldRenderFeed && feedLoading && <FeedSkeleton />}

      {shouldRenderFeed && (
        <NewsFeed
          filteredFeed={filteredFeed}
          feedLoading={feedLoading}
          feedError={feedError}
          controls={controls}
          filters={filters}
          appendToFeed={appendToFeed}
          fetchFeed={fetchFeed}
          setFeedLoading={setFeedLoading}
        />
      )}

      {userHasNoSubscriptions && (
        <h2 data-test-id="no-subs-message">
          Nothing to see here... Head over to <a href="/manage">Manage Feeds</a>{" "}
          to subscribe to your first feed!
        </h2>
      )}
    </section>
  );
};
