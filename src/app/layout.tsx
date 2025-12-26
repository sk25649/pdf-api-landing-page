import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabase/server";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.docapi.co";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Doc API - HTML to PDF API for Developers",
    template: "%s | Doc API",
  },
  description:
    "Simple HTML to PDF API. Generate PDFs and screenshots programmatically in seconds. Developer-friendly, fair pricing, no complex setup.",
  keywords: [
    "PDF API",
    "HTML to PDF",
    "PDF generation",
    "screenshot API",
    "document API",
    "PDF converter",
    "HTML to PDF API",
    "generate PDF",
    "PDF service",
  ],
  authors: [{ name: "Doc API" }],
  creator: "Doc API",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Doc API",
    title: "Doc API - HTML to PDF API for Developers",
    description:
      "Simple HTML to PDF API. Generate PDFs and screenshots programmatically in seconds. Developer-friendly, fair pricing, no complex setup.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Doc API - HTML to PDF API",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Doc API - HTML to PDF API for Developers",
    description:
      "Simple HTML to PDF API. Generate PDFs and screenshots programmatically in seconds.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link
              href={user ? "/dashboard" : "/"}
              className="text-xl font-bold"
            >
              Doc API
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/tools/invoice-generator"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Free Invoice Generator
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Blog
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Link>
              {user ? (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Log in
                </Link>
              )}
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex flex-col items-center gap-2 md:items-start">
                <Link href="/" className="text-lg font-bold">
                  Doc API
                </Link>
                <p className="text-sm text-muted-foreground">
                  Simple HTML to PDF API for developers
                </p>
              </div>
              <nav className="flex gap-8">
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold">Product</h4>
                  <Link
                    href="/docs"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Documentation
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold">Tools</h4>
                  <Link
                    href="/tools/invoice-generator"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Invoice Generator
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold">Resources</h4>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold">Legal</h4>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </nav>
            </div>
            <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Doc API. All rights reserved.
            </div>
          </div>
        </footer>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
