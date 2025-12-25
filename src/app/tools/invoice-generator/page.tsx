import type { Metadata } from "next";
import { InvoiceGeneratorClient } from "./client";

export const metadata: Metadata = {
  title: "Free Invoice Generator - Create PDF Invoices Online | DocAPI",
  description:
    "Create professional PDF invoices for free. No signup required. Download instantly or automate with our API.",
  openGraph: {
    title: "Free Invoice Generator - Create PDF Invoices Online",
    description:
      "Create professional PDF invoices for free. No signup required. Download instantly.",
  },
};

export default function InvoiceGeneratorPage() {
  return <InvoiceGeneratorClient />;
}
