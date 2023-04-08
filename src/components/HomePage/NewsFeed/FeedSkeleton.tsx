import ContentLoader from "react-content-loader";

export const FeedSkeleton = () => {
  const rows = [...Array(10).keys()];

  return (
    <div>
      <ContentLoader height="100" style={{ width: "85%", maxWidth: "750px" }}>
        <rect x="0" y="0" width="100%" height="100%" />
      </ContentLoader>

      <ContentLoader height="50" className="feed-skeleton">
        <rect x="0" y="0" width="100%" height="100%" />
      </ContentLoader>

      {rows.map((row) => (
        <ContentLoader key={row} height="75" className="feed-skeleton">
          <rect x="0" y="0" width="100%" height="100%" />
        </ContentLoader>
      ))}
    </div>
  );
};
