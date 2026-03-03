import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, Code, FileText, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "HTML to PDF Node.js API — Generate PDFs from Node.js & TypeScript",
  description:
    "Convert HTML to PDF in Node.js with npm install @docapi/sdk. Zero deps, TypeScript-first, ESM and CJS. Works in Next.js, Express, Lambda, and any Node.js 18+ runtime. Free tier: 100 PDFs/month.",
  alternates: {
    canonical: "https://www.docapi.co/html-to-pdf-nodejs",
  },
  openGraph: {
    title: "HTML to PDF Node.js API — Generate PDFs from Node.js & TypeScript",
    description:
      "Convert HTML to PDF in Node.js with npm install @docapi/sdk. Zero deps, TypeScript-first, ESM and CJS. Works in Next.js, Express, and Lambda.",
    url: "https://www.docapi.co/html-to-pdf-nodejs",
  },
};

const codeExamples = {
  basic: `import { DocAPI } from "@docapi/sdk";
import fs from "fs";

const client = new DocAPI(process.env.DOCAPI_KEY!);

const pdf = await client.pdf("<h1>Hello World</h1>", { format: "A4" });

fs.writeFileSync("output.pdf", pdf);`,

  rawFetch: `const response = await fetch("https://api.docapi.co/v1/pdf", {
  method: "POST",
  headers: {
    "x-api-key": process.env.DOCAPI_KEY!,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    html: "<h1>Hello World</h1>",
    options: { format: "A4", printBackground: true },
  }),
});

const pdf = Buffer.from(await response.arrayBuffer());
fs.writeFileSync("output.pdf", pdf);`,

  nextjs: `// app/api/invoice/[id]/route.ts
import { DocAPI } from "@docapi/sdk";

const client = new DocAPI(process.env.DOCAPI_KEY!);

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const invoice = await getInvoice(params.id);
  const html = renderInvoiceHtml(invoice);

  const pdf = await client.pdf(html, { format: "A4" });

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": \`inline; filename="invoice-\${params.id}.pdf"\`,
    },
  });
}`,

  express: `import express from "express";
import { DocAPI } from "@docapi/sdk";

const app = express();
const client = new DocAPI(process.env.DOCAPI_KEY!);

app.get("/invoices/:id.pdf", async (req, res) => {
  const html = await buildInvoiceHtml(req.params.id);
  const pdf = await client.pdf(html, { format: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    \`inline; filename="invoice-\${req.params.id}.pdf"\`
  );
  res.send(pdf);
});`,
};

export default function HtmlToPdfNodejsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium">
              <Package className="mr-2 h-4 w-4" />
              Node.js PDF API
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              HTML to PDF in Node.js{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                without Puppeteer
              </span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              One <code className="rounded bg-muted px-1.5 py-0.5 text-base font-mono">npm install @docapi/sdk</code>.
              No 150MB Chromium download, no binary dependencies. TypeScript-first,
              ESM and CJS, works in Next.js, Express, Lambda, and any Node.js 18+
              environment.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Free API Key
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs#nodejs-sdk">View Node.js SDK</Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Free tier: 100 PDFs/month. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium">
                  <Zap className="mr-1.5 h-3 w-3" />
                  30-second quickstart
                </div>
                <h2 className="mb-4 text-2xl font-bold">
                  Install and generate your first PDF
                </h2>
                <p className="mb-4 text-muted-foreground">
                  The DocAPI SDK is a zero-dependency TypeScript package that
                  ships both ESM and CJS builds. It works in any Node.js runtime
                  including AWS Lambda, Vercel Functions, and Cloudflare Workers
                  without any additional configuration or binary layers.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "npm install @docapi/sdk — zero transitive dependencies",
                    "Full TypeScript types included out of the box",
                    "ESM and CJS — works with import and require",
                    "Node.js 18+, Bun, Deno compatible",
                    "A4 / Letter / custom page dimensions",
                    "Returns a Buffer — stream or write directly",
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
                  <span className="ml-2 text-xs text-zinc-500">generate-pdf.ts</span>
                </div>
                <div className="overflow-x-auto p-4">
                  <pre className="text-xs leading-relaxed text-zinc-300">
                    <code>{codeExamples.basic}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Framework examples */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-2 text-center text-2xl font-bold">
              Drop into your existing Node.js stack
            </h2>
            <p className="mb-10 text-center text-muted-foreground">
              Works with Next.js App Router, Express, and any other Node.js framework.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Next.js App Router</h3>
                    <p className="text-xs text-muted-foreground">API route returning a PDF response</p>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg bg-zinc-950 p-3">
                  <pre className="text-xs leading-relaxed text-zinc-300">
                    <code>{codeExamples.nextjs}</code>
                  </pre>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Express route</h3>
                    <p className="text-xs text-muted-foreground">Serve PDFs from an Express endpoint</p>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg bg-zinc-950 p-3">
                  <pre className="text-xs leading-relaxed text-zinc-300">
                    <code>{codeExamples.express}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Raw fetch fallback */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl border bg-zinc-950">
                <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-zinc-500">raw-fetch.ts</span>
                </div>
                <div className="overflow-x-auto p-4">
                  <pre className="text-xs leading-relaxed text-zinc-300">
                    <code>{codeExamples.rawFetch}</code>
                  </pre>
                </div>
              </div>
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium">
                  <Code className="mr-1.5 h-3 w-3" />
                  No SDK required
                </div>
                <h2 className="mb-4 text-2xl font-bold">
                  Just use fetch — no SDK needed
                </h2>
                <p className="mb-4 text-muted-foreground">
                  The API is a plain HTTP endpoint. If you prefer not to add a
                  package, use the global <code className="rounded bg-muted px-1 py-0.5 text-xs">fetch</code> available
                  in Node.js 18+. The SDK is just a typed, ergonomic wrapper
                  around the same call.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "POST https://api.docapi.co/v1/pdf",
                    "x-api-key header for authentication",
                    "JSON body with html and options",
                    "Response is raw PDF bytes (Buffer)",
                    "Works with Node.js native fetch — no axios needed",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 text-center text-2xl font-bold">Common Node.js PDF use cases</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Invoice PDFs in Next.js",
                  desc: "Generate invoice PDFs on demand in a Next.js App Router API route. Render your React invoice component to HTML, send to DocAPI, return the PDF.",
                },
                {
                  title: "Serverless PDF generation",
                  desc: "No Chromium layer on Lambda. DocAPI handles the browser — your function stays under 50MB and cold-starts in milliseconds.",
                },
                {
                  title: "Automated report exports",
                  desc: "Schedule nightly report PDF generation with a cron job. Query your DB, build an HTML report, generate the PDF, email or upload to S3.",
                },
                {
                  title: "Contract and agreement PDFs",
                  desc: "Generate legal documents from HTML templates with per-user data. Stream PDFs directly to the browser or save to cloud storage.",
                },
                {
                  title: "SaaS document exports",
                  desc: "Let users export any page or data view as a PDF. One API call replaces a full Puppeteer setup with browser management.",
                },
                {
                  title: "E-commerce receipts",
                  desc: "Generate branded purchase receipts and order confirmations as PDFs, attached to transactional emails or available for download.",
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
              vs. Puppeteer, html-pdf, and puppeteer-core
            </h2>
            <p className="mb-8 text-center text-muted-foreground">
              Other Node.js PDF solutions require shipping a 150MB+ Chromium binary or wkhtmltopdf to your server.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-semibold">Feature</th>
                    <th className="py-3 text-center font-semibold">DocAPI</th>
                    <th className="py-3 text-center font-semibold">Puppeteer</th>
                    <th className="py-3 text-center font-semibold">html-pdf</th>
                    <th className="py-3 text-center font-semibold">puppeteer-core</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    ["No binary download", "✓", "150MB Chromium", "wkhtmltopdf", "Bring your own"],
                    ["Works in Lambda", "✓", "Complex layer", "✗", "Complex layer"],
                    ["Cold start", "~10ms", "3–5s", "~500ms", "3–5s"],
                    ["TypeScript types", "✓", "✓", "Partial", "✓"],
                    ["Full CSS support", "✓", "✓", "Partial", "✓"],
                    ["Zero npm deps", "✓", "✗", "✗", "✗"],
                    ["Free tier", "100/mo", "Self-hosted", "Self-hosted", "Self-hosted"],
                  ].map(([feature, docapi, puppeteer, htmlpdf, core]) => (
                    <tr key={feature}>
                      <td className="py-3 text-muted-foreground">{feature}</td>
                      <td className="py-3 text-center font-medium text-green-600">{docapi}</td>
                      <td className="py-3 text-center text-muted-foreground">{puppeteer}</td>
                      <td className="py-3 text-center text-muted-foreground">{htmlpdf}</td>
                      <td className="py-3 text-center text-muted-foreground">{core}</td>
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
              Start generating PDFs in Node.js today
            </h2>
            <p className="mb-6 text-muted-foreground">
              Free tier includes 100 PDFs per month — no credit card, no
              Chromium, no infrastructure to manage.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Free API Key
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs#nodejs-sdk">Node.js SDK Docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
