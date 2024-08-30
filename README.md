# Firebase Cloud Messaging Proof of Concept

This project demonstrates how to use the Firebase Cloud Messaging (FCM) API to send push notifications to web clients. The notifications can trigger the opening of a target URL, making it particularly useful for promotions and user engagement.

## Features

- Web-based push notifications using Firebase Cloud Messaging
- Custom notification content (title, body, icon)
- Click-to-open functionality that redirects users to a specified URL
- Server-side notification sending using Firebase Admin SDK
- Client-side notification handling and display

## Prerequisites

- Node.js and npm (or Bun)
- Firebase project with Cloud Messaging enabled
- Firebase Admin SDK credentials (serviceAccountKey.json)
- A domain name and access to its DNS settings (for TLS setup)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/firebase-cloud-messaging-poc.git
   cd firebase-cloud-messaging-poc
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Set up your Firebase project and obtain the necessary credentials:

   a. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)

   b. Enable Cloud Messaging in your project

   c. Obtain Firebase configuration:
- Go to Project settings (gear icon) > General
- Under "Your apps", select your web app (or create one if not exists)
- Find the Firebase SDK configuration object
- You'll use these values for environment variables:
  - apiKey
  - authDomain
  - projectId
  - storageBucket
  - messagingSenderId
  - appId

d. Get your VAPID key:
- In Firebase Console, go to Project **settings** > Cloud Messaging
- Scroll to the "Web configuration" section
- Generate and copy the "Web Push certificate" (This is your VAPID key)

e. Generate a service account key:
- In Firebase Console, go to Project settings > Service Accounts
- Click "Generate new private key"
- Save the downloaded JSON file as `serviceAccountKey.json` in your project root

4. Configure environment variables:
   Create a `.env` file in the project root and add the following variables:
   ```
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   FIREBASE_APP_ID=your-app-id
   FIREBASE_VAPID_KEY=your-web-push-certificate
   BASE_URL=https://your-subdomain.your-domain.com
   ```
   Replace the placeholder values with those obtained from your Firebase project configuration and your secure domain (see TLS Setup section).

## TLS Setup

Web Push notifications only work in TLS-secured environments. Here's how to set up TLS for testing:

1. Use a domain you own or register a new one.

2. Set up Cloudflare for your domain:
  - Add your domain to Cloudflare
  - Update your domain's nameservers to those provided by Cloudflare

3. Create a Cloudflare Tunnel to your local development environment:
  - Install the Cloudflare Tunnel client (cloudflared)
  - Authenticate cloudflared with your Cloudflare account
  - Create a new tunnel and configure it to point to your local server (e.g., `localhost:4200`)

4. Set up a subdomain for testing:
  - In Cloudflare DNS settings, create a CNAME record for your chosen subdomain (e.g., `fcm-test`) pointing to your tunnel

5. Enable Cloudflare's Development Mode:
  - Go to the Cloudflare dashboard for your domain
  - Navigate to the "Caching" section
  - Turn on "Development Mode" to prevent caching issues during testing

6. Update your `.env` file:
   Set `BASE_URL=https://your-subdomain.your-domain.com` (e.g., `https://fcm-test.example.com`)

This setup allows you to test your application with a secure HTTPS connection, which is required for web push notifications. It also enables testing on mobile devices on the same network.

## Running the Application

1. Start the server:
   ```
   bun run dev
   ```

2. Open a web browser and navigate to your Cloudflare Tunnel URL (e.g., `https://fcm-test.example.com`)

3. Allow notifications when prompted

4. The FCM token will be displayed on the page. You can use this token to send test notifications.

## Sending a Test Notification

You can send a test notification using the UI button or by making a POST request to the `/send-notification` endpoint:

```bash
curl -X POST "https://your-subdomain.your-domain.com/send-notification" -H "Content-Type: application/json" -d '{"token": "FCM_TOKEN", "title": "Test Notification", "body": "This is a test notification from FCM!"}'
```

Replace `FCM_TOKEN` with the actual token displayed on the web page and update the URL to match your Cloudflare Tunnel URL.

## Project Structure

- `index.ts`: Main server file that handles routing and notification sending
- `app.ts`: Client-side JavaScript for handling FCM setup and notification reception
- `firebase.ts`: Firebase configuration and initialization
- `firebase-messaging-sw.ts`: Service Worker for handling background notifications
- `public/`: Directory for static files (HTML, CSS, images)
