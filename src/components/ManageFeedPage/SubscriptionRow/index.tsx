import type { Subscription } from "utils/types";
import { deleteRequest } from "utils/api";

import "./styles.css";

interface Props {
  subscription: Subscription;
  token: string;
}

export const SubscriptionRow = ({ subscription, token }: Props) => {
  const handleUnsubscribe = async (subscriptionId: number) => {
    try {
      const { status } = await deleteRequest<{ status: number }>({
        path: "/subscription",
        token,
        body: { subscriptionId },
      });

      if (status === 200) {
        window.location.reload();
      } else {
        // TODO: handle error
      }
    } catch {
      // TODO: handle error
    }
  };

  return (
    <li className="row">
      <p className="feed">{subscription.feedName}</p>

      <div className="btn-wrapper">
        <button
          id="unsubscribeButton"
          className="btn"
          onClick={() => {
            handleUnsubscribe(subscription.id);
          }}
        >
          Unsubscribe
        </button>
      </div>
    </li>
  );
};
