// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
function urlBase64ToUint8Array(base64String: string) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const updateToggleState = (isChecked: boolean) => {
  const toggle = document.getElementById(
    "notif-toggle"
  ) as HTMLInputElement | null;

  if (toggle) {
    toggle.checked = isChecked;
  }
};

const registerNotificationSubscription = async () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    await navigator.serviceWorker.register("service-worker.js");
  } catch (error) {
    console.error("Service worker registration failed:", error);
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const existingSubscription = await registration.pushManager.getSubscription();

  if (existingSubscription) {
    return;
  }

  const response = await fetch("/notification.json");
  const vapidPublicKey = await response.text();
  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await registration.pushManager.subscribe({
    // we don't plan to send notifications that don't have a visible effect for the user
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey,
  });

  fetch("notification.json", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ subscription, origin: window.location.origin }),
  });
};

type NotificationPermissionStatus = "granted" | "not-granted";

const requestNotificationPermission =
  async (): Promise<NotificationPermissionStatus> => {
    const permission = await Notification.requestPermission();

    let status: NotificationPermissionStatus | undefined;

    if (permission === "granted") {
      console.log("Notification permission is currently granted.");
      status = "granted";
    } else {
      console.log("Notification permission is currently:", permission);
      status = "not-granted";
    }

    return status;
  };

/** @throws {Error} */
export const toggleNotificationPreference = async (
  preference: "enabled" | "disabled"
) => {
  const data = await fetch("/notification.json", {
    method: "PUT",
    body: JSON.stringify({ preference }),
    headers: { "Content-Type": "application/json" },
  });

  if (data.status !== 201) {
    throw new Error(`Error updating notification preference to: ${preference}`);
  }
};

/** @throws {Error} */
export const attemptToEnableNotifications = async () => {
  try {
    await toggleNotificationPreference("enabled");
  } catch (error) {
    console.error("Server error. Will not request notification permission");
    throw error;
  }

  const notificationPermissionStatus = await requestNotificationPermission();

  if (notificationPermissionStatus === "not-granted") {
    updateToggleState(false);

    console.warn(
      "Notification permission not granted. Will not register notification subscription."
    );
    return;
  }

  try {
    registerNotificationSubscription();
  } catch (error) {
    console.error("Error registering notification subscription.");
    throw error;
  }
};
