import { z } from "zod";

export const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unitPrice: z.number().min(0, "Price must be 0 or greater"),
});

export const invoiceSchema = z.object({
  // Company details
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email("Invalid email").or(z.literal("")),
  companyAddress: z.string().optional(),
  companyLogo: z.string().optional(),

  // Client details
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email").or(z.literal("")),
  clientAddress: z.string().optional(),

  // Invoice details
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),

  // Line items
  lineItems: z.array(lineItemSchema).min(1, "At least one line item is required"),

  // Totals
  taxRate: z.number().min(0).max(100),

  // Additional
  notes: z.string().optional(),
  paymentInstructions: z.string().optional(),
});

export type LineItem = z.infer<typeof lineItemSchema>;
export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export function calculateLineItemAmount(item: LineItem): number {
  return item.quantity * item.unitPrice;
}

export function calculateSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + calculateLineItemAmount(item), 0);
}

export function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * (taxRate / 100);
}

export function calculateTotal(subtotal: number, taxAmount: number): number {
  return subtotal + taxAmount;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function getDefaultInvoiceDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function getDefaultDueDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split("T")[0];
}
