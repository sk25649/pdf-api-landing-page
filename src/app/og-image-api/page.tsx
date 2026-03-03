import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, Globe, Code, Image } from "lucide-react";

export const metadata: Metadata = {
  title: "OG Image API — Generate Dynamic Open Graph Images",
  description:
    "Generate dynamic Open Graph images and social cards via API. Send a URL or HTML, get a 1200x630 PNG back. Works in Next.js, Node.js, Python, and any framework. Free tier available.",
  alternates: {
    canonical: "https://www.docapi.co/og-image-api",
  },
  openGraph: {
    title: "OG Image API — Generate Dynamic Open Graph Images",
    description:
      "Generate dynamic Open Graph images and social cards via API. Send a URL or HTML, get a 1200x630 PNG back.",
    url: "https://www.docapi.co/og-image-api",
  },
};

const codeExamples = {
  curl: `curl -X POST https://api.docapi.co/v1/screenshot \\
  -H "x-api-key: pk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://yoursite.com/blog/my-post",
    "options": {
      "width": 1200,
      "height": 630,
      "format": "png"
    }
  }' --output og-image.png`,

  html: `curl -X POST https://api.docapi.co/v1/screenshot \\
  -H "x-api-key: pk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "html": "<div style=\\"width:1200px;height:630px;background:#0f172a;display:flex;align-items:center;padding:80px\\"><div><p style=\\"color:#94a3b8;font-size:18px\\">My Blog</p><h1 style=\\"color:white;font-size:64px;margin:16px 0\\">How to build an API</h1><p style=\\"color:#64748b;font-size:20px\\">5 min read</p></div></div>",
    "options": { "width": 1200, "height": 630, "format": "png" }
  }' --output og-image.png`,

  nextjs: `// app/api/og/route.tsx
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get('title') ?? 'My Page'

  const html = \`
    <div style="width:1200px;height:630px;background:#0f172a;
                display:flex;align-items:center;padding:80px;
                font-family:system-ui,sans-serif">
      <div>
        <h1 style="color:white;font-size:64px;margin:0">\${title}</h1>
        <p style="color:#94a3b8;font-size:24px;margin-top:16px">
          docapi.co
        </p>
      </div>
    </div>\`

  const res = await fetch('https://api.docapi.co/v1/screenshot', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.DOCAPI_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ html, options: { width: 1200, height: 630, format: 'png' } }),
  })

  return new Response(res.body, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' },
  })
}`,
};

export default function OgImageApiPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium">
              <Image className="mr-2 h-4 w-4" />
              OG Image API
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Dynamic Open Graph images{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                via API
              </span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Send a URL or HTML template. Get a 1200×630 PNG back. Generate
              social cards, blog post previews, and Open Graph images
              programmatically — no headless browser to manage.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get API Key Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">View Docs</Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Free tier: 100 images/month. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Two modes */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-2 text-center text-2xl font-bold">
              Two ways to generate
            </h2>
            <p className="mb-10 text-center text-muted-foreground">
              Capture a live URL, or render custom HTML directly.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">From a URL</h3>
                    <p className="text-xs text-muted-foreground">Screenshot any live page</p>
                  </div>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Point the API at any URL and get back a pixel-perfect screenshot
                  at exactly 1200×630. Perfect for auto-generating OG images from
                  your existing pages.
                </p>
                <div className="overflow-x-auto rounded-lg bg-zinc-950 p-3">
                  <pre className="text-xs text-zinc-300">
                    <code>{`{
  "url": "https://yoursite.com/post/slug",
  "options": {
    "width": 1200,
    "height": 630,
    "format": "png"
  }
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">From HTML</h3>
                    <p className="text-xs text-muted-foreground">Render a custom template</p>
                  </div>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Pass an HTML string with your title, description, and branding.
                  Full CSS support including custom fonts, gradients, and images.
                  The exact same card every time.
                </p>
                <div className="overflow-x-auto rounded-lg bg-zinc-950 p-3">
                  <pre className="text-xs text-zinc-300">
                    <code>{`{
  "html": "<div style='width:1200px;
    height:630px;background:#0f172a'>
    <h1>{{title}}</h1>
  </div>",
  "options": { "width": 1200, "height": 630 }
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next.js integration */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium">
                  <Zap className="mr-1.5 h-3 w-3" />
                  Next.js integration
                </div>
                <h2 className="mb-4 text-2xl font-bold">
                  Drop-in Next.js OG image route
                </h2>
                <p className="mb-4 text-muted-foreground">
                  Replace <code className="rounded bg-muted px-1 py-0.5 text-xs">@vercel/og</code> or
                  your custom Puppeteer setup with a single API route. No
                  edge runtime restrictions, no font loading quirks, no 1MB
                  response size limits.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Works in Node.js runtime (not edge-only)",
                    "Full CSS — gradients, shadows, custom fonts",
                    "Cache the response with Cache-Control headers",
                    "Dynamic titles, descriptions, and metadata from params",
                    "No font file bundling required",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="overflow-hidden rounded-xl border bg-zinc-950">
                <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-zinc-500">app/api/og/route.tsx</span>
                </div>
                <div className="overflow-x-auto p-4">
                  <pre className="text-xs leading-relaxed text-zinc-300">
                    <code>{codeExamples.nextjs}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 text-center text-2xl font-bold">Common use cases</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Blog post previews",
                  desc: "Auto-generate a unique OG image for every blog post using the title, author, and publication date. Triggered on publish.",
                },
                {
                  title: "Product social cards",
                  desc: "Dynamic product images for sharing on X/Twitter and LinkedIn. Different image per product, generated on demand.",
                },
                {
                  title: "User profile cards",
                  desc: "Shareable profile images with username, avatar, and stats. Generated server-side on each profile visit.",
                },
                {
                  title: "Dashboard screenshots",
                  desc: "Weekly automated screenshots of dashboards or reports, sent via email or Slack. Zero browser management.",
                },
                {
                  title: "Event announcements",
                  desc: "Branded announcement cards for webinars, launches, or releases. One template, different data per event.",
                },
                {
                  title: "AI-generated content",
                  desc: "AI agents building web apps can add OG image support in one registration call. Autonomous, no human setup.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border bg-card p-5">
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* vs @vercel/og */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-center text-2xl font-bold">
              vs. @vercel/og and Puppeteer
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-semibold">Feature</th>
                    <th className="py-3 text-center font-semibold">DocAPI</th>
                    <th className="py-3 text-center font-semibold">@vercel/og</th>
                    <th className="py-3 text-center font-semibold">Puppeteer</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    ["Full CSS support", "✓", "Limited (Satori)", "✓"],
                    ["Node.js runtime", "✓", "Edge only", "✓"],
                    ["Custom fonts (URL)", "✓", "Must bundle files", "✓"],
                    ["Screenshot from URL", "✓", "✗", "✓"],
                    ["No binary deps", "✓", "✓", "✗"],
                    ["Serverless friendly", "✓", "✓", "Complex"],
                    ["Free tier", "100/mo", "Vercel plan", "Self-hosted"],
                  ].map(([feature, docapi, vercel, puppeteer]) => (
                    <tr key={feature}>
                      <td className="py-3 text-muted-foreground">{feature}</td>
                      <td className="py-3 text-center font-medium text-green-600">{docapi}</td>
                      <td className="py-3 text-center text-muted-foreground">{vercel}</td>
                      <td className="py-3 text-center text-muted-foreground">{puppeteer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-4 text-2xl font-bold">Start generating OG images</h2>
            <p className="mb-6 text-muted-foreground">
              Free tier includes 100 images per month — enough to ship and validate.
              Same API key works for both PDFs and screenshots.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Free API Key
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs#post-v1-screenshot">Screenshot API Docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
