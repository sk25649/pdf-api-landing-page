"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Code, ArrowRight } from "lucide-react";
import { InvoiceForm } from "./components/InvoiceForm";
import { InvoicePreview } from "./components/InvoicePreview";
import {
  invoiceSchema,
  InvoiceFormData,
  getDefaultInvoiceDate,
  getDefaultDueDate,
} from "./types";

export function InvoiceGeneratorClient() {
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      companyName: "",
      companyEmail: "",
      companyAddress: "",
      companyLogo: "",
      clientName: "",
      clientEmail: "",
      clientAddress: "",
      invoiceNumber: "INV-001",
      invoiceDate: getDefaultInvoiceDate(),
      dueDate: getDefaultDueDate(),
      lineItems: [{ description: "", quantity: 1, unitPrice: 0 }],
      taxRate: 0,
      notes: "",
      paymentInstructions: "",
    },
    mode: "onChange",
  });

  async function handleDownload() {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    const data = form.getValues();

    // Check for empty line items
    const hasValidItems = data.lineItems.some(
      (item) => item.description && item.quantity > 0
    );
    if (!hasValidItems) {
      toast.error("Please add at least one line item with a description");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/tools/generate-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate invoice");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${data.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate invoice"
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Free Invoice Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Create professional PDF invoices in seconds. No signup required.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <InvoiceForm form={form} />

            {/* Download Button */}
            <div className="mt-6 sticky bottom-4 lg:static">
              <Button
                onClick={handleDownload}
                disabled={isGenerating}
                size="lg"
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Preview</h2>
              <p className="text-sm text-muted-foreground">
                Live preview of your invoice
              </p>
            </div>
            <div className="rounded-lg border bg-gray-100 p-4">
              <InvoicePreview form={form} />
            </div>
          </div>
        </div>
      </div>

      {/* Upsell Section */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Need to generate invoices automatically?
            </h2>
            <p className="text-muted-foreground text-lg">
              Integrate with our API to generate unlimited invoices
              programmatically. Perfect for SaaS platforms, e-commerce, and
              billing systems.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
                <Code className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Example API Call</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="text-muted-foreground">{`const response = await fetch('https://api.docapi.co/v1/pdf', {
  method: 'POST',
  headers: {
    'x-api-key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    html: invoiceHTML,
    options: { format: 'A4' }
  })
});

const pdf = await response.arrayBuffer();`}</code>
              </pre>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="https://app.docapi.co">
                  Get API Key
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/docs">View Documentation</a>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">100</div>
                <div className="text-sm text-muted-foreground">
                  Free PDFs/month
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">&lt;1s</div>
                <div className="text-sm text-muted-foreground">
                  Average response time
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
