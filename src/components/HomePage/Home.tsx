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
    fetchFeed,
  } = useFeed({ token });

  const shouldRenderFeed = !!feed?.length && feed.length > 0 && !feedError;
  const userHasNoSubscriptions =
    feed && !feed?.length && !feedLoading && !feedError;

  return (
    <section style={{ textAlign: "center" }}>
      {feedError && <h2>{feedError}</h2>}
      {!shouldRenderFeed && feedLoading && <FeedSkeleton />}

      {shouldRenderFeed && (
        <NewsFeed
          filteredFeed={filteredFeed}
          feedLoading={feedLoading}
          feedError={feedError}
          controls={controls}
          filters={filters}
          fetchFeed={fetchFeed}
        />
      )}

      {userHasNoSubscriptions && (
        <h2>
          Nothing to see here... Head over to
          <a href="/manage">Manage Feeds</a>
          to subscribe to your first feed!
        </h2>
      )}
    </section>
  );
};
