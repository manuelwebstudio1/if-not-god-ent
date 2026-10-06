import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { StoreHydration } from "@/components/providers/store-provider";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col overflow-x-hidden antialiased">
        <StoreHydration>{children}</StoreHydration>
      </body>
    </html>
  );
}
