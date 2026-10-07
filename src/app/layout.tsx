import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import SettingsProvider from "@/features/settings/components/SettingsProvider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Nexa Utility",
    template: "%s | Nexa Utility",
  },
  description:
    "Nexa Utility — your unified workspace for everyday tools, productivity, study, media, and more.",
  applicationName: "Nexa Utility",
  generator: "Nexa Utility",
  keywords: [
    "Nexa Utility",
    "utility workspace",
    "productivity",
    "calculator",
    "calendar",
    "notes",
    "weather",
    "camera",
    "study tools",
  ],
  authors: [{ name: "Nexa Utility" }],
  creator: "Nexa Utility",
  publisher: "Nexa Utility",

  icons: {
    icon: [
      {
        url: "/brand/nexa-logo.png",
        type: "image/png",
      },
    ],
    shortcut: ["/brand/nexa-logo.png"],
    apple: [
      {
        url: "/brand/nexa-logo.png",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    title: "Nexa Utility",
    description:
      "Your unified utility workspace for everyday tools, productivity, study, media, and more.",
    siteName: "Nexa Utility",
    type: "website",
    images: [
      {
        url: "/brand/nexa-logo.png",
        width: 512,
        height: 512,
        alt: "Nexa Utility",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Nexa Utility",
    description:
      "Your unified utility workspace for everyday tools, productivity, study, media, and more.",
    images: ["/brand/nexa-logo.png"],
  },

  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#050816",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SettingsProvider>
          <AppShell>{children}</AppShell>
        </SettingsProvider>
      </body>
    </html>
  );
}
