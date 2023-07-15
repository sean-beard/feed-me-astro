import { useMemo, useState } from "react";
import { post } from "utils/api";

import "./styles.css";
import { SubscriptionError } from "./SubscriptionError";

interface SubscribeData {
  status: number;
  message: string;
}

interface Props {
  token: string;
  refetchSubs: () => Promise<void>;
}

export const SubscriptionForm = ({ token, refetchSubs }: Props) => {
  const [feedUrl, setFeedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<number>();

  const errorUrl = useMemo(
    () =>
      `https://github.com/sean-beard/feed-me-astro/issues/new?title=Unsupported%20RSS%20Format&body=URL:%20${feedUrl}`,
    [feedUrl]
  );

  const handleSubscription = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorCode(undefined);

    if (!feedUrl) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await post<SubscribeData>({
        path: "/subscription",
        token,
        body: { url: feedUrl },
      });

      if (response.status !== 200) {
        setErrorCode(response.status);
        setIsLoading(false);
        return;
      }

      await refetchSubs();
      setIsLoading(false);
      setFeedUrl("");
    } catch {
      setErrorCode(500);
      setIsLoading(false);
    }
  };

  return (
    <section className="manage-feeds-section">
      <h2 style={{ marginBottom: "2rem" }}>Subscribe to a feed</h2>

      <SubscriptionError
        errorCode={errorCode}
        errorUrl={errorUrl}
        onClose={() => {
          setErrorCode(undefined);
        }}
      />

      <form onSubmit={handleSubscription}>
        <div className="input-field">
          <input
            id="feedUrl"
            name="feedUrl"
            className="input-field"
            type="text"
            value={feedUrl}
            onChange={(event) => {
              setFeedUrl(event.target.value);
            }}
          />
          <label className={feedUrl ? "active" : ""} htmlFor="feedUrl">
            Enter the RSS feed URL
          </label>
        </div>

        <button
          data-test-id="subscribe-button"
          type="submit"
          disabled={isLoading}
          className="btn"
        >
          {isLoading ? "Subscribing" : "Subscribe"}
        </button>
      </form>
    </section>
  );
};
