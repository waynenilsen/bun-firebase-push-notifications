import { serve } from "bun";
import { readFileSync } from "fs";
import admin from "firebase-admin";
import type { TokenMessage } from "firebase-admin/messaging";

// Function to build frontend files
async function buildFrontend() {
  console.log("Building frontend files...");
  const frontendEnvVars = [
    "FIREBASE_API_KEY",
    "FIREBASE_AUTH_DOMAIN",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_STORAGE_BUCKET",
    "FIREBASE_MESSAGING_SENDER_ID",
    "FIREBASE_APP_ID",
    "FIREBASE_VAPID_KEY",
  ];
  const define: Record<string, string> = {};
  for (const envVar of frontendEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
    define[`process.env.${envVar}`] = JSON.stringify(process.env[envVar]);
  }

  await Bun.build({
    entrypoints: ["./app.ts"],
    outdir: "./public/js",
    minify: false,
    sourcemap: "inline",
    target: "bun",
    define,
  });

  await Bun.build({
    entrypoints: ["./firebase-messaging-sw.ts"],
    outdir: "./public",
    minify: false,
    sourcemap: "inline",
    target: "browser",
    define,
  });
  console.log("Frontend build complete.");
}

// Initial build
await buildFrontend();

const port = 4200;
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8"),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const server = serve({
  port: port,
  async fetch(req: Request) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response(Bun.file("public/index.html"));
    }

    if (url.pathname === "/send-notification" && req.method === "POST") {
      try {
        const { token, title, body } = await req.json();
        console.log(
          'curl -X POST "' + process.env.BASE_URL + "/send-notification\" -d '",
          JSON.stringify({ token, title, body }),
          '\' -H "Content-Type: application/json"',
        );
        const message: TokenMessage = {
          token: token,
          data: {
            icon: "/img.png",
            destinationUrl: process.env.BASE_URL!,
            title: title,
            body: body,
          },
        };

        const response = await admin.messaging().send(message);
        return new Response(JSON.stringify({ success: true, response }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error sending notification:", error);
        return new Response(
          JSON.stringify({ error: "Failed to send notification" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    // Serve static files
    return new Response(Bun.file("public" + url.pathname));
  },
});

console.log(`Server running at ${process.env.BASE_URL}`);
