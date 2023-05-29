import ContentLoader from "react-content-loader";

export const SubscriptionListSkeleton = () => {
  return (
    <div>
      <ContentLoader height="30" width="265">
        <rect x="0" y="0" width="100%" height="100%" />
      </ContentLoader>

      <br />
      <br />

      <ContentLoader height="65" width="550">
        <rect x="0" y="0" width="100%" height="100%" />
      </ContentLoader>
    </div>
  );
};
