import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFirebaseApp } from "./firebase.ts";

const app = getFirebaseApp();
const messaging = getMessaging(app);

document.addEventListener("DOMContentLoaded", () => {
  const tokenDiv = document.getElementById("token");
  const notificationButton = document.getElementById("sendNotification");
  if (!tokenDiv || !notificationButton) {
    console.error("Element not found.");
    return;
  }

  // Request notification permission and get FCM token
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      getToken(messaging, {
        vapidKey: process.env.FIREBASE_VAPID_KEY,
      })
        .then((currentToken) => {
          if (currentToken) {
            console.log("FCM Token:", currentToken);
            tokenDiv.textContent = currentToken;
          } else {
            console.log(
              "No registration token available. Request permission to generate one.",
            );
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });
    } else {
      console.log("Unable to get permission to notify.");
    }
  });

  // Listen for messages
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    // You can handle the message here, e.g., display a notification
  });

  // Send notification
  notificationButton.addEventListener("click", async () => {
    const token = tokenDiv.textContent;
    const response = await fetch("/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        title: "Test Notification",
        body: "This is a test notification from FCM!",
      }),
    });
    const result = await response.json();
    console.log("Notification send result:", result);
  });
});
