import { useEffect, useState } from "react";

import {
  attemptToEnableNotifications,
  registerNotificationSubscription,
  toggleNotificationPreference,
} from "utils/serviceWorker";
import type { Account, Subscription } from "utils/types";
import { SubscriptionListSkeleton } from "./Skeleton";
import { SubscriptionRow } from "./SubscriptionRow";

import "./styles.css";
import { getAccountPreferences } from "utils/account";

interface Props {
  token: string;
  subs: Subscription[];
  loading: boolean;
  error: string;
  refetchSubs: () => Promise<void>;
}

export const SubscriptionList = ({
  token,
  subs,
  loading,
  error,
  refetchSubs,
}: Props) => {
  const [notificationToggleEnabled, setNotificationToggleEnabled] =
    useState(false);

  useEffect(() => {
    getAccountPreferences().then((preferences) => {
      setNotificationToggleEnabled(preferences.notificationsEnabled);
    });
  }, []);

  const handleNotificationPreferenceToggle = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const toggleElement = event.target as HTMLInputElement | null;

    const shouldEnableNotifications = Boolean(toggleElement?.checked);

    if (!shouldEnableNotifications) {
      try {
        await toggleNotificationPreference("disabled");
        setNotificationToggleEnabled(false);
      } catch (error) {
        setNotificationToggleEnabled(true);
        console.error("Server error:", error);
      }
    }

    if (shouldEnableNotifications) {
      try {
        await attemptToEnableNotifications();
        setNotificationToggleEnabled(true);
      } catch (error) {
        setNotificationToggleEnabled(false);
        console.error("Error attempting to enable notifications:", error);
      }
    }
  };

  return (
    <div className="subscription-list">
      <h2>Your subscriptions</h2>

      {loading && !subs.length && <SubscriptionListSkeleton />}
      {error && <h3 className="error">{error}</h3>}

      {subs.length > 0 && (
        <div className="switch">
          <label>
            Nofitications: Off
            <input
              id="notif-toggle"
              type="checkbox"
              checked={notificationToggleEnabled}
              onChange={handleNotificationPreferenceToggle}
            />
            <span className="lever" />
            On
          </label>
        </div>
      )}

      {subs.length > 0 && (
        <ul>
          {subs.map((subscription) => {
            return (
              <SubscriptionRow
                key={subscription.id}
                subscription={subscription}
                token={token}
                refetchSubs={refetchSubs}
              />
            );
          })}
        </ul>
      )}

      {!subs.length && !loading && (
        <p>Nothing to see here! Subscribe to your first feed above.</p>
      )}
    </div>
  );
};
