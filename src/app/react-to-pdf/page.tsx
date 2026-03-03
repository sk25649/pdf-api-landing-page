import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, Code, FileText, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "React to PDF — Export React Components as PDFs",
  description:
    "Convert React components to PDFs server-side using ReactDOMServer and DocAPI. Preserves all CSS including Tailwind, no client-side canvas tricks. Works in Next.js App Router. Free tier: 100 PDFs/month.",
  alternates: {
    canonical: "https://www.docapi.co/react-to-pdf",
  },
  openGraph: {
    title: "React to PDF — Export React Components as PDFs",
    description:
      "Convert React components to PDFs server-side using ReactDOMServer and DocAPI. Preserves all CSS including Tailwind. Works in Next.js App Router.",
    url: "https://www.docapi.co/react-to-pdf",
  },
};

const codeExamples = {
  basicComponent: `// components/InvoiceTemplate.tsx
export function InvoiceTemplate({ invoice }: { invoice: Invoice }) {
  return (
    <html>
      <head>
        <style>{\`
          body { font-family: system-ui, sans-serif; margin: 0; padding: 40px; }
          .header { display: flex; justify-content: space-between; }
          .total { font-size: 24px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        \`}</style>
      </head>
      <body>
        <div className="header">
          <h1>{invoice.companyName}</h1>
          <div>
            <p>Invoice #{invoice.number}</p>
            <p>{invoice.date}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>\${item.price}</td>
                <td>\${item.qty * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="total">Total: \${invoice.total}</p>
      </body>
    </html>
  );
}`,

  apiRoute: `// app/api/invoice/route.ts
import { renderToStaticMarkup } from "react-dom/server";
import { DocAPI } from "@docapi/sdk";
import { InvoiceTemplate } from "@/components/InvoiceTemplate";

const client = new DocAPI(process.env.DOCAPI_KEY!);

export async function POST(req: Request) {
  const data = await req.json();

  // Render your React component to an HTML string server-side
  const html = renderToStaticMarkup(<InvoiceTemplate {...data} />);

  // Send to DocAPI — returns raw PDF bytes
  const pdf = await client.pdf(
    \`<!DOCTYPE html><html><body>\${html}</body></html>\`,
    { format: "A4", printBackground: true }
  );

  return new Response(pdf, {
    headers: { "Content-Type": "application/pdf" },
  });
}`,

  tailwindExample: `// Works with Tailwind CSS too — inline the stylesheet
import { renderToStaticMarkup } from "react-dom/server";
import { DocAPI } from "@docapi/sdk";
import fs from "fs";

const client = new DocAPI(process.env.DOCAPI_KEY!);
const tailwindCss = fs.readFileSync("public/tailwind.css", "utf-8");

export async function POST(req: Request) {
  const data = await req.json();

  const componentHtml = renderToStaticMarkup(<ReportTemplate {...data} />);

  // Wrap with Tailwind CSS inline
  const html = \`<!DOCTYPE html>
    <html>
      <head><style>\${tailwindCss}</style></head>
      <body class="bg-white p-10">\${componentHtml}</body>
    </html>\`;

  const pdf = await client.pdf(html, { format: "A4" });

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=report.pdf",
    },
  });
}`,

  downloadButton: `// Client component — download PDF from a button click
"use client";

export function DownloadPdfButton({ invoiceData }: { invoiceData: Invoice }) {
  const handleDownload = async () => {
    const res = await fetch("/api/invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = \`invoice-\${invoiceData.number}.pdf\`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload}>
      Download PDF
    </button>
  );
}`,
};

export default function ReactToPdfPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium">
              <Layers className="mr-2 h-4 w-4" />
              React to PDF
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Export React components{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                as pixel-perfect PDFs
              </span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Render your React components to HTML with{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-base font-mono">renderToStaticMarkup</code>,
              send to DocAPI, get a PDF back. No new JSX DSL to learn, no
              canvas tricks, no client-side slowness. Preserves all CSS
              including Tailwind.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Free API Key
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

      {/* How it works */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-2 text-center text-2xl font-bold">
              How React-to-PDF works
            </h2>
            <p className="mb-10 text-center text-muted-foreground">
              Three steps — render, send, receive. No client-side JavaScript required in the PDF.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Render to HTML",
                  desc: "Use ReactDOMServer.renderToStaticMarkup() to convert your React component to a plain HTML string on the server. Works in Next.js API routes and server actions.",
                },
                {
                  step: "2",
                  title: "Send to DocAPI",
                  desc: "POST the HTML string to https://api.docapi.co/v1/pdf with your API key. Specify page format, margins, and other options in the request body.",
                },
                {
                  step: "3",
                  title: "Receive PDF bytes",
                  desc: "DocAPI renders the HTML in Chromium and returns raw PDF bytes. Stream them directly to the browser as a download or save to cloud storage.",
                },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border bg-card p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* React component example */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-start gap-12 md:grid-cols-2">
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium">
                  <Code className="mr-1.5 h-3 w-3" />
                  Step 1: your React component
                </div>
                <h2 className="mb-4 text-2xl font-bold">
                  Write a regular React component
                </h2>
                <p className="mb-4 text-muted-foreground">
                  Your PDF template is just a React component. Use inline
                  styles or a stylesheet injected via a{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">{"<style>"}</code> tag.
                  No special PDF-specific JSX syntax, no learning a new
                  primitive API like react-pdf requires.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Standard React JSX — no new APIs to learn",
                    "Inline styles or a <style> tag for CSS",
                    "Props-driven — different data per PDF",
                    "Reuse existing components and formatters",
                    "TypeScript support end-to-end",
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
                  <span className="ml-2 text-xs text-zinc-500">components/InvoiceTemplate.tsx</span>
                </div>
                <div className="overflow-x-auto p-4">
                  <pre className="text-xs leading-relaxed text-zinc-300">
                    <code>{codeExamples.basicComponent}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API route example */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-start gap-12 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl border bg-zinc-950">
                <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-zinc-500">app/api/invoice/route.ts</span>
                </div>
                <div className="overflow-x-auto p-4">
                  <pre className="text-xs leading-relaxed text-zinc-300">
                    <code>{codeExamples.apiRoute}</code>
                  </pre>
                </div>
              </div>
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium">
                  <Zap className="mr-1.5 h-3 w-3" />
                  Step 2 + 3: render and convert
                </div>
                <h2 className="mb-4 text-2xl font-bold">
                  Next.js API route — render and convert in one step
                </h2>
                <p className="mb-4 text-muted-foreground">
                  In a Next.js API route or server action, call{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">renderToStaticMarkup</code>{" "}
                  to get the HTML string, then send it to DocAPI. The whole
                  round-trip — render + convert + stream — is typically under
                  500ms.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "renderToStaticMarkup — no hydration JS in the PDF",
                    "Works in Next.js App Router route handlers",
                    "Stream PDF bytes directly to the browser",
                    "Set Content-Disposition for inline view or download",
                    "No temp files — fully in-memory",
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

      {/* Tailwind example */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-start gap-12 md:grid-cols-2">
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium">
                  <FileText className="mr-1.5 h-3 w-3" />
                  Tailwind CSS support
                </div>
                <h2 className="mb-4 text-2xl font-bold">
                  Works with Tailwind — inline the stylesheet
                </h2>
                <p className="mb-4 text-muted-foreground">
                  Tailwind generates a CSS file. Read it with{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">fs.readFileSync</code>{" "}
                  and inject it into a{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">{"<style>"}</code>{" "}
                  tag in your HTML wrapper. DocAPI renders the Tailwind-styled
                  HTML in Chromium, so all utility classes work exactly as in
                  the browser.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "All Tailwind utility classes work in PDFs",
                    "Print media queries respected (hidden, print:block)",
                    "Dark mode classes can be excluded via PurgeCSS",
                    "No viewport size restrictions — full A4 width",
                    "Custom fonts via @font-face in the stylesheet",
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
                  <span className="ml-2 text-xs text-zinc-500">app/api/report/route.ts</span>
                </div>
                <div className="overflow-x-auto p-4">
                  <pre className="text-xs leading-relaxed text-zinc-300">
                    <code>{codeExamples.tailwindExample}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client download button */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-start gap-12 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl border bg-zinc-950">
                <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-zinc-500">components/DownloadPdfButton.tsx</span>
                </div>
                <div className="overflow-x-auto p-4">
                  <pre className="text-xs leading-relaxed text-zinc-300">
                    <code>{codeExamples.downloadButton}</code>
                  </pre>
                </div>
              </div>
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium">
                  <Zap className="mr-1.5 h-3 w-3" />
                  Client-side trigger
                </div>
                <h2 className="mb-4 text-2xl font-bold">
                  Add a &quot;Download PDF&quot; button to any page
                </h2>
                <p className="mb-4 text-muted-foreground">
                  The client component simply fetches the API route and
                  triggers a browser download via a temporary object URL. The
                  PDF generation itself happens entirely on the server — no
                  client-side rendering, no canvas, no jsPDF.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Click button → fetch API route → trigger download",
                    "PDF generation is 100% server-side",
                    "No client-side PDF library needed",
                    "Works in any React app, not just Next.js",
                    "Can also open inline in browser tab",
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
            <h2 className="mb-10 text-center text-2xl font-bold">Common React PDF use cases</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Invoice PDFs from React",
                  desc: "Build your invoice UI as a React component. Reuse it on-screen and as a PDF — same template, same data, same formatting.",
                },
                {
                  title: "Report exports",
                  desc: "Export data-heavy reports as PDFs. Render tables, charts (as SVG), and summaries from your React components with real data.",
                },
                {
                  title: "Certificate generation",
                  desc: "Generate styled completion certificates or badges from a React template with dynamic name, date, and course data.",
                },
                {
                  title: "Contract PDFs",
                  desc: "Render legal agreements from a React template with per-user data. Server-side generation means consistent, reproducible output.",
                },
                {
                  title: "Proposal and quote PDFs",
                  desc: "Sales teams can generate branded proposal PDFs from a React template populated with CRM data, pricing, and custom notes.",
                },
                {
                  title: "Onboarding documents",
                  desc: "Welcome packets, onboarding guides, and policy documents generated from React templates with company and employee-specific data.",
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
              vs. react-pdf, jsPDF, and html2canvas
            </h2>
            <p className="mb-8 text-center text-muted-foreground">
              Other React PDF tools require learning a new API, run client-side, or produce low-fidelity output.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-semibold">Feature</th>
                    <th className="py-3 text-center font-semibold">DocAPI</th>
                    <th className="py-3 text-center font-semibold">react-pdf</th>
                    <th className="py-3 text-center font-semibold">jsPDF</th>
                    <th className="py-3 text-center font-semibold">html2canvas</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    ["Use regular JSX", "✓", "Custom DSL", "✗", "✓"],
                    ["Server-side generation", "✓", "✓", "✗", "✗"],
                    ["Full CSS fidelity", "✓", "Limited", "✗", "Partial"],
                    ["Tailwind support", "✓", "✗", "✗", "✗"],
                    ["No client JS needed", "✓", "✓", "Client only", "Client only"],
                    ["Selectable text in PDF", "✓", "✓", "✗", "✗ (image)"],
                    ["Free tier", "100/mo", "Open source", "Open source", "Open source"],
                  ].map(([feature, docapi, reactpdf, jspdf, html2canvas]) => (
                    <tr key={feature}>
                      <td className="py-3 text-muted-foreground">{feature}</td>
                      <td className="py-3 text-center font-medium text-green-600">{docapi}</td>
                      <td className="py-3 text-center text-muted-foreground">{reactpdf}</td>
                      <td className="py-3 text-center text-muted-foreground">{jspdf}</td>
                      <td className="py-3 text-center text-muted-foreground">{html2canvas}</td>
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
              Start generating PDFs from React today
            </h2>
            <p className="mb-6 text-muted-foreground">
              Free tier includes 100 PDFs per month. No credit card, no new
              DSL to learn — just render your existing React components to
              HTML and call the API.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Free API Key
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
