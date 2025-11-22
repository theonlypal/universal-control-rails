import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import { Shell } from "../components/Shell";
import { PWAInit } from "../components/PWAInit";

export const metadata: Metadata = {
  title: "Universal Control Rails",
  description: "Phone-first control OS for any device.",
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0ea5e9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <PWAInit />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
