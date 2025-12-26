import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const lineItemSchema = z.object({
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
});

const invoiceSchema = z.object({
  companyName: z.string(),
  companyEmail: z.string().optional(),
  companyAddress: z.string().optional(),
  companyLogo: z.string().optional(),
  clientName: z.string(),
  clientEmail: z.string().optional(),
  clientAddress: z.string().optional(),
  invoiceNumber: z.string(),
  invoiceDate: z.string(),
  dueDate: z.string(),
  lineItems: z.array(lineItemSchema),
  discountType: z.enum(["percentage", "fixed"]).default("percentage"),
  discountValue: z.number().default(0),
  taxRate: z.number().default(0),
  notes: z.string().optional(),
  paymentInstructions: z.string().optional(),
});

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

function generateInvoiceHTML(data: z.infer<typeof invoiceSchema>): string {
  const subtotal = data.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const discountAmount =
    data.discountType === "percentage"
      ? subtotal * (data.discountValue / 100)
      : Math.min(data.discountValue, subtotal);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (data.taxRate / 100);
  const total = subtotal - discountAmount + taxAmount;

  const lineItemsHTML = data.lineItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${item.description}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111827;">${item.quantity}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111827;">${formatCurrency(item.unitPrice)}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500; color: #111827;">${formatCurrency(item.quantity * item.unitPrice)}</td>
      </tr>
    `
    )
    .join("");

  const logoHTML = data.companyLogo
    ? `<img src="${data.companyLogo}" alt="Company logo" style="height: 48px; width: auto; object-fit: contain; margin-bottom: 8px;" />`
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #374151;
          line-height: 1.5;
          background: white;
        }
        .invoice {
          max-width: 800px;
          margin: 0 auto;
          padding: 48px;
        }
      </style>
    </head>
    <body>
      <div class="invoice">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; padding-bottom: 24px; border-bottom: 2px solid #e5e7eb;">
          <div>
            ${logoHTML}
            <h2 style="font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 4px;">${data.companyName}</h2>
            ${data.companyEmail ? `<p style="font-size: 14px; color: #6b7280;">${data.companyEmail}</p>` : ""}
            ${data.companyAddress ? `<p style="font-size: 14px; color: #6b7280; white-space: pre-line; margin-top: 4px;">${data.companyAddress}</p>` : ""}
          </div>
          <div style="text-align: right;">
            <h1 style="font-size: 32px; font-weight: 700; color: #111827;">INVOICE</h1>
            <p style="font-size: 16px; color: #6b7280; margin-top: 4px;">#${data.invoiceNumber}</p>
          </div>
        </div>

        <!-- Bill To & Invoice Details -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <div>
            <h3 style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Bill To</h3>
            <p style="font-weight: 500; color: #111827; font-size: 16px;">${data.clientName}</p>
            ${data.clientEmail ? `<p style="font-size: 14px; color: #6b7280;">${data.clientEmail}</p>` : ""}
            ${data.clientAddress ? `<p style="font-size: 14px; color: #6b7280; white-space: pre-line; margin-top: 4px;">${data.clientAddress}</p>` : ""}
          </div>
          <div style="text-align: right;">
            <div style="margin-bottom: 8px;">
              <span style="font-size: 14px; color: #6b7280;">Invoice Date: </span>
              <span style="font-size: 14px; font-weight: 500; color: #111827;">${formatDate(data.invoiceDate)}</span>
            </div>
            <div>
              <span style="font-size: 14px; color: #6b7280;">Due Date: </span>
              <span style="font-size: 14px; font-weight: 500; color: #111827;">${formatDate(data.dueDate)}</span>
            </div>
          </div>
        </div>

        <!-- Line Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
          <thead>
            <tr style="border-bottom: 2px solid #e5e7eb;">
              <th style="text-align: left; padding: 12px 0; font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Description</th>
              <th style="text-align: right; padding: 12px 0; font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; width: 80px;">Qty</th>
              <th style="text-align: right; padding: 12px 0; font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; width: 100px;">Price</th>
              <th style="text-align: right; padding: 12px 0; font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; width: 120px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${lineItemsHTML}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
          <div style="width: 280px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span style="color: #6b7280;">Subtotal</span>
              <span style="font-weight: 500; color: #111827;">${formatCurrency(subtotal)}</span>
            </div>
            ${
              discountAmount > 0
                ? `
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span style="color: #6b7280;">Discount${data.discountType === "percentage" ? ` (${data.discountValue}%)` : ""}</span>
              <span style="font-weight: 500; color: #16a34a;">-${formatCurrency(discountAmount)}</span>
            </div>
            `
                : ""
            }
            ${
              data.taxRate > 0
                ? `
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span style="color: #6b7280;">Tax (${data.taxRate}%)</span>
              <span style="font-weight: 500; color: #111827;">${formatCurrency(taxAmount)}</span>
            </div>
            `
                : ""
            }
            <div style="display: flex; justify-content: space-between; padding: 16px 0; border-top: 2px solid #111827; margin-top: 8px;">
              <span style="font-size: 18px; font-weight: 700; color: #111827;">Total</span>
              <span style="font-size: 18px; font-weight: 700; color: #111827;">${formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <!-- Notes & Payment Instructions -->
        ${
          data.notes || data.paymentInstructions
            ? `
        <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
          ${
            data.notes
              ? `
          <div style="margin-bottom: 16px;">
            <h3 style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Notes</h3>
            <p style="font-size: 14px; color: #6b7280; white-space: pre-line;">${data.notes}</p>
          </div>
          `
              : ""
          }
          ${
            data.paymentInstructions
              ? `
          <div>
            <h3 style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Payment Instructions</h3>
            <p style="font-size: 14px; color: #6b7280; white-space: pre-line;">${data.paymentInstructions}</p>
          </div>
          `
              : ""
          }
        </div>
        `
            : ""
        }
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = invoiceSchema.parse(body);

    // Validate line items
    if (data.lineItems.length === 0) {
      return NextResponse.json(
        { error: "At least one line item is required" },
        { status: 400 }
      );
    }

    const html = generateInvoiceHTML(data);

    // Check if DocAPI key is available
    const apiKey = process.env.DOCAPI_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "PDF generation is not configured. Please set DOCAPI_KEY environment variable." },
        { status: 500 }
      );
    }

    // Call DocAPI to generate PDF
    const pdfResponse = await fetch("https://api.docapi.co/v1/pdf", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "User-Agent": "DocAPI-InvoiceGenerator/1.0",
        "Accept": "application/pdf",
      },
      body: JSON.stringify({
        html,
        options: {
          format: "A4",
          margin: {
            top: "10mm",
            bottom: "10mm",
            left: "10mm",
            right: "10mm",
          },
          printBackground: true,
        },
      }),
    });

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.error("DocAPI error:", errorText);
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: 500 }
      );
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${data.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Invoice generation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid invoice data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
