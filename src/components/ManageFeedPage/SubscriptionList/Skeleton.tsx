import ContentLoader from "react-content-loader";

export const SubscriptionListSkeleton = () => {
  const rows = [...Array(5).keys()];

  return (
    <div>
      <ContentLoader
        height="30"
        width="265"
        style={{ display: "block", margin: "0 auto", marginBottom: "20px" }}
      >
        <rect x="0" y="0" width="100%" height="100%" />
      </ContentLoader>

      {rows.map((row) => (
        <ContentLoader
          key={row}
          height="55"
          width="550"
          style={{ display: "block", margin: "0 auto", marginBottom: "8px" }}
        >
          <rect x="0" y="0" width="100%" height="100%" />
        </ContentLoader>
      ))}
    </div>
  );
};
