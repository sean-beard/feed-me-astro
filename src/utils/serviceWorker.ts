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

export const registerNotificationSubscription = async () => {
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
