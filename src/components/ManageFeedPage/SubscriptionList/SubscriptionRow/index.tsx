import { useState } from "react";
import { deleteRequest } from "utils/api";
import type { Subscription } from "utils/types";

import "./styles.css";

interface Props {
  subscription: Subscription;
  refetchSubs: () => Promise<void>;
  token: string;
}

export const SubscriptionRow = ({
  subscription,
  token,
  refetchSubs,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUnsubscribe = async (subscriptionId: number) => {
    setIsLoading(true);

    try {
      const { status } = await deleteRequest<{ status: number }>({
        path: "/subscription",
        token,
        body: { subscriptionId },
      });

      if (status === 200) {
        await refetchSubs();
      } else {
        // TODO: handle error
      }
    } catch {
      // TODO: handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="row">
      <p className="feed">{subscription.feedName}</p>

      <button
        id="unsubscribeButton"
        className="btn"
        disabled={isLoading}
        onClick={() => {
          handleUnsubscribe(subscription.id);
        }}
      >
        <i className="material-icons">delete</i>
        <span className="visually-hidden">
          Unsubscribe from {subscription.feedName}
        </span>
      </button>
    </li>
  );
};
