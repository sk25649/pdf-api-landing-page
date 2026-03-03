import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, Code, FileText, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "HTML to PDF Python API — Generate PDFs from Python",
  description:
    "Convert HTML to PDF in Python with one pip install. Zero system dependencies — no wkhtmltopdf, no WeasyPrint setup. Works with Django, Flask, and FastAPI. Free tier: 100 PDFs/month.",
  alternates: {
    canonical: "https://www.docapi.co/html-to-pdf-python",
  },
  openGraph: {
    title: "HTML to PDF Python API — Generate PDFs from Python",
    description:
      "Convert HTML to PDF in Python with one pip install. Zero system dependencies — no wkhtmltopdf, no WeasyPrint setup. Works with Django, Flask, and FastAPI.",
    url: "https://www.docapi.co/html-to-pdf-python",
  },
};

const codeExamples = {
  basic: `from docapi import DocAPI

client = DocAPI("pk_live_...")

pdf = client.pdf("<h1>Hello World</h1>", format="A4")

with open("output.pdf", "wb") as f:
    f.write(pdf)`,

  rawRequests: `import requests

response = requests.post(
    "https://api.docapi.co/v1/pdf",
    headers={
        "x-api-key": "pk_live_...",
        "Content-Type": "application/json",
    },
    json={
        "html": "<h1>Hello World</h1>",
        "options": {"format": "A4", "printBackground": True},
    },
)

with open("output.pdf", "wb") as f:
    f.write(response.content)`,

  django: `from django.http import HttpResponse
from django.template.loader import render_to_string
from docapi import DocAPI
import os

client = DocAPI(os.environ["DOCAPI_KEY"])

def invoice_view(request, pk):
    invoice = Invoice.objects.get(pk=pk)
    html = render_to_string("invoice.html", {"invoice": invoice})
    pdf = client.pdf(html, format="A4")
    return HttpResponse(
        pdf,
        content_type="application/pdf",
        headers={
            "Content-Disposition": f'inline; filename="invoice-{pk}.pdf"'
        },
    )`,

  flask: `from flask import Flask, send_file
from docapi import DocAPI
import io, os

app = Flask(__name__)
client = DocAPI(os.environ["DOCAPI_KEY"])

@app.route("/invoice/<int:pk>.pdf")
def invoice_pdf(pk):
    html = build_invoice_html(pk)
    pdf = client.pdf(html)
    return send_file(
        io.BytesIO(pdf),
        mimetype="application/pdf",
        download_name=f"invoice-{pk}.pdf",
    )`,
};

export default function HtmlToPdfPythonPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium">
              <Terminal className="mr-2 h-4 w-4" />
              Python PDF API
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              HTML to PDF in Python{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                without the headaches
              </span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              One <code className="rounded bg-muted px-1.5 py-0.5 text-base font-mono">pip install docapi-sdk</code>.
              No system packages, no wkhtmltopdf binary, no WeasyPrint C
              dependencies. Works in Django, Flask, FastAPI, and any Python
              3.8+ environment.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Free API Key
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs#python-sdk">View Python SDK</Link>
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
                  The DocAPI Python SDK has zero dependencies and ships as a
                  single pure-Python package. No C extensions, no system
                  libraries, no binary blobs. It works anywhere Python runs —
                  including AWS Lambda, Google Cloud Functions, and Docker
                  containers.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "pip install docapi-sdk — that's the only step",
                    "Python 3.8+ supported, zero third-party deps",
                    "Full A4 / Letter / custom page size support",
                    "Print background colors and images by default",
                    "Returns raw bytes — stream directly to response or disk",
                    "Automatic retry on transient errors",
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
                  <span className="ml-2 text-xs text-zinc-500">generate_pdf.py</span>
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
              Works with your existing Python framework
            </h2>
            <p className="mb-10 text-center text-muted-foreground">
              Drop DocAPI into Django, Flask, or any other framework with a few lines of code.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Django view</h3>
                    <p className="text-xs text-muted-foreground">Render a template and stream as PDF</p>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg bg-zinc-950 p-3">
                  <pre className="text-xs leading-relaxed text-zinc-300">
                    <code>{codeExamples.django}</code>
                  </pre>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Flask route</h3>
                    <p className="text-xs text-muted-foreground">Return a PDF directly from a route</p>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg bg-zinc-950 p-3">
                  <pre className="text-xs leading-relaxed text-zinc-300">
                    <code>{codeExamples.flask}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Raw requests fallback */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl border bg-zinc-950">
                <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-zinc-500">raw_requests.py</span>
                </div>
                <div className="overflow-x-auto p-4">
                  <pre className="text-xs leading-relaxed text-zinc-300">
                    <code>{codeExamples.rawRequests}</code>
                  </pre>
                </div>
              </div>
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium">
                  <Code className="mr-1.5 h-3 w-3" />
                  No SDK required
                </div>
                <h2 className="mb-4 text-2xl font-bold">
                  Prefer raw HTTP? Use requests directly.
                </h2>
                <p className="mb-4 text-muted-foreground">
                  The API is a simple REST endpoint. If you would rather not add
                  another package, call it directly with <code className="rounded bg-muted px-1 py-0.5 text-xs">requests</code> or
                  Python&apos;s built-in <code className="rounded bg-muted px-1 py-0.5 text-xs">urllib</code>. The SDK is just a thin
                  convenience wrapper around the same HTTP call.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "POST https://api.docapi.co/v1/pdf",
                    "x-api-key header for authentication",
                    "JSON body with html and options fields",
                    "Response body is raw PDF bytes",
                    "Same API key for PDFs and screenshots",
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
            <h2 className="mb-10 text-center text-2xl font-bold">Common Python PDF use cases</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Invoice generation",
                  desc: "Render your Jinja2 invoice template and return a PDF response from your Django or Flask view. Triggered on every order confirmation.",
                },
                {
                  title: "Report exports",
                  desc: "Export data reports and dashboards as shareable PDFs. Query your database, render to HTML, and stream the PDF to the browser.",
                },
                {
                  title: "E-signature documents",
                  desc: "Generate agreement or contract PDFs from templates with customer-specific data, ready to be sent for signing via DocuSign or similar.",
                },
                {
                  title: "Shipping labels & receipts",
                  desc: "Produce thermal-printer-ready or standard PDF shipping labels and packing slips from order data in your Python backend.",
                },
                {
                  title: "Statement generation",
                  desc: "Monthly account statements, bank-style PDFs, and financial summaries generated server-side from your data warehouse.",
                },
                {
                  title: "Content archiving",
                  desc: "Scrape or export web content as persistent PDF archives. Useful for compliance workflows, legal discovery, and long-term record-keeping.",
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
              vs. WeasyPrint, pdfkit, and ReportLab
            </h2>
            <p className="mb-8 text-center text-muted-foreground">
              Other Python PDF libraries require heavy system dependencies or force you to learn a new API.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-semibold">Feature</th>
                    <th className="py-3 text-center font-semibold">DocAPI</th>
                    <th className="py-3 text-center font-semibold">WeasyPrint</th>
                    <th className="py-3 text-center font-semibold">pdfkit</th>
                    <th className="py-3 text-center font-semibold">ReportLab</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    ["Zero system deps", "✓", "Requires Cairo, Pango", "Requires wkhtmltopdf", "✓"],
                    ["pip install only", "✓", "✗", "✗", "✓"],
                    ["Full CSS support", "✓", "Partial", "✓", "✗"],
                    ["Works in Lambda", "✓", "Complex layer", "✗", "✓"],
                    ["Rendered by Chromium", "✓", "✗", "✓ (old)", "✗"],
                    ["Django/Flask ready", "✓", "✓", "✓", "Complex"],
                    ["Free tier", "100/mo", "Self-hosted", "Self-hosted", "Self-hosted"],
                  ].map(([feature, docapi, weasy, pdfkit, reportlab]) => (
                    <tr key={feature}>
                      <td className="py-3 text-muted-foreground">{feature}</td>
                      <td className="py-3 text-center font-medium text-green-600">{docapi}</td>
                      <td className="py-3 text-center text-muted-foreground">{weasy}</td>
                      <td className="py-3 text-center text-muted-foreground">{pdfkit}</td>
                      <td className="py-3 text-center text-muted-foreground">{reportlab}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-4 text-2xl font-bold">
              Simple, predictable pricing
            </h2>
            <p className="mb-8 text-muted-foreground">
              Start free, scale when you need to. No credit card required to
              get started.
            </p>
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              {[
                { plan: "Free", price: "$0/mo", calls: "100 PDFs/month" },
                { plan: "Starter", price: "$19/mo", calls: "1,000 PDFs/month" },
                { plan: "Pro", price: "$49/mo", calls: "5,000 PDFs/month" },
                { plan: "Business", price: "$99/mo", calls: "20,000 PDFs/month" },
              ].map((tier) => (
                <div key={tier.plan} className="rounded-xl border bg-card p-4 text-left">
                  <p className="text-sm font-semibold">{tier.plan}</p>
                  <p className="text-xl font-bold">{tier.price}</p>
                  <p className="text-sm text-muted-foreground">{tier.calls}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Free API Key
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs#python-sdk">Python SDK Docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
