import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Navigation } from "@/components/Navigation";
import { NotificationManager } from "@/components/NotificationManager";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krishna Bhakti - Spiritual Journey",
  description:
    "Immerse yourself in divine chanting, track your spiritual progress, and deepen your devotion to Lord Krishna",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <NotificationManager />
            <Navigation />
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}