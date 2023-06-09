import { useState } from "react";
import { post } from "utils/api";

import "./styles.css";

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
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscription = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    if (!feedUrl) {
      return;
    }

    setIsLoading(true);

    try {
      await post<SubscribeData>({
        path: "/subscription",
        token,
        body: { url: feedUrl },
      });

      await refetchSubs();
      setIsLoading(false);
      setFeedUrl("");
    } catch {
      setIsLoading(false);

      setErrorMessage(
        "Oops! There was an error loading your subscriptions. Please try again later."
      );
    }
  };

  return (
    <section className="manage-feeds-section">
      <h2>Subscribe to a feed</h2>

      {errorMessage && <h3 className="error">{errorMessage}</h3>}

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
