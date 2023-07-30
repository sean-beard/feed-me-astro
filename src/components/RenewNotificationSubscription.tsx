import { useEffect } from "react";
import { getAccountPreferences } from "utils/account";
import { registerNotificationSubscription } from "utils/serviceWorker";

const renew = async () => {
  try {
    // This is a workaround to renew any expired notification subs
    const preferences = await getAccountPreferences();

    if (preferences.notificationsEnabled) {
      registerNotificationSubscription();
    }
  } catch {
    // stub
  }
};

export const RenewNotificationSubscription = () => {
  useEffect(() => {
    renew();
  }, []);

  return <></>;
};
