const ErrorCard = ({
  children,
  onClose,
}: {
  children: JSX.Element | JSX.Element[];
  onClose: () => void;
}) => {
  return (
    <div className="error-card">
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="unstyled-button" onClick={onClose}>
          <i className="material-icons">close</i>
        </button>
      </div>

      {children}
    </div>
  );
};

interface Props {
  errorUrl: string;
  errorCode?: number;
  onClose: () => void;
}

export const SubscriptionError = ({ errorUrl, errorCode, onClose }: Props) => {
  if (!errorCode) {
    return null;
  }

  if (errorCode === 415) {
    return (
      <ErrorCard onClose={onClose}>
        <h3 className="error">Unsupported RSS feed format</h3>

        <p>
          Please{" "}
          <a href={errorUrl} target="_blank" rel="noopener">
            open an issue and include the URL
          </a>{" "}
          you've attempted to subscribe to so we can support it going forward.
        </p>
      </ErrorCard>
    );
  }

  return (
    <ErrorCard onClose={onClose}>
      <h3 className="error">
        Oops! There was a problem subscribing. Please try again later.
      </h3>
    </ErrorCard>
  );
};
