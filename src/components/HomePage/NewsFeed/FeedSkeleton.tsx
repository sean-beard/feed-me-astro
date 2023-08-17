import ContentLoader from "react-content-loader";

const BLUE = "#1a237e";

export const FeedItemsSkeleton = () => {
  const rows = [...Array(10).keys()];

  return (
    <div>
      {rows.map((row) => (
        <ContentLoader
          key={row}
          backgroundColor={BLUE}
          height="75"
          className="feed-skeleton"
        >
          <rect x="0" y="0" width="100%" height="100%" />
        </ContentLoader>
      ))}
    </div>
  );
};

export const FeedSkeleton = () => {
  return (
    <div>
      <ContentLoader
        backgroundColor={BLUE}
        height="100"
        style={{ width: "85%", maxWidth: "750px" }}
      >
        <rect x="0" y="0" width="100%" height="100%" />
      </ContentLoader>

      <ContentLoader
        backgroundColor={BLUE}
        height="50"
        className="feed-skeleton"
      >
        <rect x="0" y="0" width="100%" height="100%" />
      </ContentLoader>

      <FeedItemsSkeleton />
    </div>
  );
};
