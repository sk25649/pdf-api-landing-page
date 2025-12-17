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

export const metadata: Metadata = {
  title: "Doc API",
  description: "Doc API - Transform your documents",
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
                href="/blog"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Blog
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
