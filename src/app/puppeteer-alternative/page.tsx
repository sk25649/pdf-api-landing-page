import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, Code, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Puppeteer Alternative — Generate PDFs Without Chromium",
  description:
    "Drop Puppeteer and generate PDFs without a 150MB Chromium download. DocAPI works in Lambda, Vercel, and any serverless environment. 10ms cold start vs 3–5s for Puppeteer. Free tier: 100 PDFs/month.",
  alternates: {
    canonical: "https://www.docapi.co/puppeteer-alternative",
  },
  openGraph: {
    title: "Puppeteer Alternative — Generate PDFs Without Chromium",
    description:
      "Drop Puppeteer and generate PDFs without a 150MB Chromium download. DocAPI works in Lambda, Vercel, and any serverless environment with a 10ms cold start.",
    url: "https://www.docapi.co/puppeteer-alternative",
  },
};

const codeExamples = {
  puppeteerBefore: `// Before: Puppeteer — verbose, heavy, fragile in serverless
import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  // Required flags for Lambda/Docker
  args: ["--no-sandbox", "--disable-setuid-sandbox",
         "--disable-dev-shm-usage", "--single-process"],
  executablePath: process.env.CHROMIUM_PATH || undefined,
});

const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle0" });
const pdf = await page.pdf({
  format: "A4",
  printBackground: true,
  margin: { top: "40px", right: "40px", bottom: "40px", left: "40px" },
});
await browser.close();

// + 150MB Chromium download on npm install
// + Custom Lambda layer or Docker layer
// + 3–5s cold starts
// + Memory spikes on concurrent requests
// + Memory leaks if browser.close() throws`,

  docapiAfter: `// After: DocAPI — 3 lines, works everywhere
import { DocAPI } from "@docapi/sdk";

const client = new DocAPI(process.env.DOCAPI_KEY);
const pdf = await client.pdf(html, { format: "A4" });
// done — no browser, no memory management, no binary layers`,

  lambda: `// AWS Lambda handler — just works, no layer needed
import { DocAPI } from "@docapi/sdk";

const client = new DocAPI(process.env.DOCAPI_KEY!);

export const handler = async (event: AWSLambda.APIGatewayEvent) => {
  const { html } = JSON.parse(event.body ?? "{}");
  const pdf = await client.pdf(html, { format: "A4" });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/pdf" },
    body: pdf.toString("base64"),
    isBase64Encoded: true,
  };
};`,

  vercel: `// Vercel serverless function — no edge runtime needed
import { DocAPI } from "@docapi/sdk";

const client = new DocAPI(process.env.DOCAPI_KEY!);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id")!;

  const html = await buildReportHtml(id);
  const pdf = await client.pdf(html, { format: "A4" });

  return new Response(pdf, {
    headers: { "Content-Type": "application/pdf" },
  });
}`,
};

export default function PuppeteerAlternativePage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium">
              <Zap className="mr-2 h-4 w-4" />
              Puppeteer Alternative
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Generate PDFs without{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                managing Chromium
              </span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Puppeteer is a great tool — but for PDF generation it brings 150MB
              of Chromium, 3–5 second cold starts, Lambda layer headaches, and
              memory management bugs. DocAPI does the same job in 3 lines with
              a 10ms cold start and zero binaries.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Drop Puppeteer Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">View Docs</Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Free tier: 100 PDFs/month. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-2 text-center text-2xl font-bold">
              The real cost of running Puppeteer in production
            </h2>
            <p className="mb-10 text-center text-muted-foreground">
              Puppeteer works fine on your laptop. It&apos;s the serverless and container
              deployment where things get painful.
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: X,
                  title: "150MB+ binary on every deploy",
                  desc: "Puppeteer downloads a full Chromium binary on npm install. That bloats your Lambda package, Docker image, and CI cache dramatically.",
                },
                {
                  icon: X,
                  title: "3–5 second cold starts",
                  desc: "Launching a headless browser takes seconds. In serverless environments where cold starts are common, this is a real user-facing latency problem.",
                },
                {
                  icon: X,
                  title: "Lambda layer complexity",
                  desc: 'Running Puppeteer on AWS Lambda requires a custom layer with Chromium binaries compiled for the right Amazon Linux version — and keeping it updated.',
                },
                {
                  icon: X,
                  title: "Memory spikes under load",
                  desc: "Each concurrent PDF request spins up a browser page. Under load, memory usage spikes unpredictably and OOM errors crash your function.",
                },
                {
                  icon: X,
                  title: "Browser leak bugs",
                  desc: 'If your PDF generation throws before browser.close(), the browser process leaks. These are subtle bugs that only appear in production under load.',
                },
                {
                  icon: X,
                  title: "Sandbox flags for containers",
                  desc: 'Docker and Kubernetes require --no-sandbox and other Chromium flags to run. Easy to forget, painful to debug when it breaks in a new environment.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border bg-card p-5">
                  <item.icon className="mb-3 h-5 w-5 text-red-500" />
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-2 text-center text-2xl font-bold">
              Before and after
            </h2>
            <p className="mb-10 text-center text-muted-foreground">
              Same output. Dramatically less code and zero infrastructure overhead.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-400">
                    Before — Puppeteer
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl border border-red-200 bg-zinc-950 dark:border-red-900">
                  <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-zinc-500">generate-pdf-puppeteer.ts</span>
                  </div>
                  <div className="overflow-x-auto p-4">
                    <pre className="text-xs leading-relaxed text-zinc-300">
                      <code>{codeExamples.puppeteerBefore}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-400">
                    After — DocAPI
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl border border-green-200 bg-zinc-950 dark:border-green-900">
                  <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-zinc-500">generate-pdf-docapi.ts</span>
                  </div>
                  <div className="overflow-x-auto p-4">
                    <pre className="text-xs leading-relaxed text-zinc-300">
                      <code>{codeExamples.docapiAfter}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serverless examples */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-3 flex justify-center">
              <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium">
                <Zap className="mr-1.5 h-3 w-3" />
                Serverless-native
              </div>
            </div>
            <h2 className="mb-2 text-center text-2xl font-bold">
              Works anywhere — no layers, no config
            </h2>
            <p className="mb-10 text-center text-muted-foreground">
              The same 3-line API call works identically on Lambda, Vercel, Cloudflare, and your local machine.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AWS Lambda</h3>
                    <p className="text-xs text-muted-foreground">No custom runtime, no Chromium layer</p>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg bg-zinc-950 p-3">
                  <pre className="text-xs leading-relaxed text-zinc-300">
                    <code>{codeExamples.lambda}</code>
                  </pre>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Vercel / Next.js</h3>
                    <p className="text-xs text-muted-foreground">Works in Node.js runtime, not edge-only</p>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg bg-zinc-950 p-3">
                  <pre className="text-xs leading-relaxed text-zinc-300">
                    <code>{codeExamples.vercel}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DocAPI benefits */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-bold">
                  Same PDF quality. None of the browser overhead.
                </h2>
                <p className="mb-6 text-muted-foreground">
                  DocAPI uses a managed Chromium fleet on the server side — so
                  you get identical, pixel-perfect PDF output without any of the
                  infrastructure burden. We handle browser pooling, memory
                  management, scaling, and updates.
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "~10ms cold start vs 3–5s for Puppeteer (no browser launch)",
                    "Zero deployment footprint — no binary, no layer, no container change",
                    "Concurrent requests handled by our fleet — no OOM on your function",
                    "No browser.close() leak bugs — stateless HTTP call",
                    "Same Chromium rendering engine — identical PDF output",
                    "Full CSS, custom fonts, print media queries all work",
                    "Margin, header, footer, and page break control",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-4">
                {[
                  { label: "Cold start", puppeteer: "3–5 seconds", docapi: "~10ms" },
                  { label: "Deployment size", puppeteer: "+150MB Chromium", docapi: "+0 bytes" },
                  { label: "Lambda setup", puppeteer: "Custom layer required", docapi: "Works out of the box" },
                  { label: "Memory per request", puppeteer: "~200MB spike", docapi: "Negligible (HTTP call)" },
                  { label: "Concurrent PDFs", puppeteer: "One browser per worker", docapi: "Unlimited (our fleet)" },
                ].map((row) => (
                  <div key={row.label} className="rounded-lg border bg-card p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {row.label}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Puppeteer</p>
                        <p className="font-medium text-red-600">{row.puppeteer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">DocAPI</p>
                        <p className="font-medium text-green-600">{row.docapi}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 text-center text-2xl font-bold">Where DocAPI replaces Puppeteer</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Invoice and receipt PDFs",
                  desc: "Generate customer-facing PDF invoices and receipts on demand from your Node.js or Python backend. No browser to launch.",
                },
                {
                  title: "Serverless document generation",
                  desc: "Lambda or Vercel functions that generate PDFs without needing a custom Chromium layer or docker image. Instant cold starts.",
                },
                {
                  title: "Scheduled report exports",
                  desc: "Nightly cron jobs that generate HTML reports and convert to PDF. No long-running browser process to manage on a cron worker.",
                },
                {
                  title: "SaaS PDF export features",
                  desc: "Add 'Export as PDF' to any page in your SaaS. One API call per export — no per-tenant browser instance needed.",
                },
                {
                  title: "Contract generation",
                  desc: "Legal document generation from HTML templates. Predictable output, fast generation, no browser pool to scale.",
                },
                {
                  title: "CI/CD PDF artifacts",
                  desc: "Generate PDF documentation, changelogs, or test reports as part of your build pipeline without spinning up a Chromium container.",
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

      {/* Comparison table */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-2 text-center text-2xl font-bold">
              vs. Puppeteer, html-pdf, and Playwright
            </h2>
            <p className="mb-8 text-center text-muted-foreground">
              Every browser-based PDF tool has the same fundamental tradeoff: you must ship and manage a browser binary.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-semibold">Feature</th>
                    <th className="py-3 text-center font-semibold">DocAPI</th>
                    <th className="py-3 text-center font-semibold">Puppeteer</th>
                    <th className="py-3 text-center font-semibold">html-pdf</th>
                    <th className="py-3 text-center font-semibold">Playwright</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    ["No binary download", "✓", "150MB Chromium", "wkhtmltopdf", "300MB+ browsers"],
                    ["Cold start time", "~10ms", "3–5s", "~500ms", "3–5s"],
                    ["Works in Lambda", "✓", "Custom layer", "✗", "Custom layer"],
                    ["No memory leaks", "✓", "Manual close()", "Manual close()", "Manual close()"],
                    ["Full CSS support", "✓", "✓", "Partial", "✓"],
                    ["Serverless friendly", "✓", "Complex", "✗", "Complex"],
                    ["Free tier", "100/mo", "Self-hosted", "Self-hosted", "Self-hosted"],
                  ].map(([feature, docapi, puppeteer, htmlpdf, playwright]) => (
                    <tr key={feature}>
                      <td className="py-3 text-muted-foreground">{feature}</td>
                      <td className="py-3 text-center font-medium text-green-600">{docapi}</td>
                      <td className="py-3 text-center text-muted-foreground">{puppeteer}</td>
                      <td className="py-3 text-center text-muted-foreground">{htmlpdf}</td>
                      <td className="py-3 text-center text-muted-foreground">{playwright}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-4 text-2xl font-bold">
              Ready to remove Puppeteer from your project?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Free tier includes 100 PDFs per month. Replace Puppeteer in your
              project today — no credit card, no Chromium, no infrastructure
              changes.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Drop Puppeteer Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">View Docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
