import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import { getFirebaseApp } from "./firebase.ts";

declare var self: ServiceWorkerGlobalScope;
declare var clients: Clients;

const firebaseApp = getFirebaseApp();
const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  if (!payload || !payload.data) {
    console.log("No payload received.");
    return;
  }

  const notificationTitle = payload.data.title;
  const notificationOptions: NotificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    data: { url: payload.data.destinationUrl }, // Store URL in notification data
  };

  self.registration
    .showNotification(notificationTitle, notificationOptions)
    .then(() => console.log("Notification shown."))
    .catch((error) => console.error("Error showing notification:", error));
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  console.log("[Service Worker] Notification click Received.");

  event.notification.close();

  const url = event.notification.data?.url;
  if (!url) {
    return;
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there is already a window/tab open with the target URL
        for (var i = 0; i < windowClients.length; i++) {
          var client = windowClients[i];
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        // If no window/tab is already open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }),
  );
});
