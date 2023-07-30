import type { Account } from "./types";

export const getAccountPreferences = async () => {
  const response = await fetch("/account.json", {
    headers: { "Content-Type": "application/json" },
  });

  const account: Account = await response.json();

  const notificationsEnabled =
    !!account.notificationEnabled && Notification.permission === "granted";

  return { notificationsEnabled };
};
