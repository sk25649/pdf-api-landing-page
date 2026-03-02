import type { Metadata } from "next";
import Script from "next/script";
import dynamic from "next/dynamic";

const InvoiceGeneratorClient = dynamic(
  () => import("./client").then((m) => m.InvoiceGeneratorClient),
  { ssr: false }
);

const siteUrl = "https://www.docapi.co";
const toolUrl = `${siteUrl}/tools/invoice-generator`;

export const metadata: Metadata = {
  title: "Free Invoice Generator - Create PDF Invoices Online | DocAPI",
  description:
    "Create professional PDF invoices for free. No signup required. Download instantly or automate with our API.",
  alternates: {
    canonical: toolUrl,
  },
  openGraph: {
    title: "Free Invoice Generator - Create PDF Invoices Online",
    description:
      "Create professional PDF invoices for free. No signup required. Download instantly.",
    url: toolUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Invoice Generator",
  url: toolUrl,
  description:
    "Create professional PDF invoices for free. No signup required. Download instantly or automate with the Doc API.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "PDF invoice generation",
    "Custom line items",
    "Tax and discount support",
    "Instant download",
    "No signup required",
  ],
  provider: {
    "@type": "Organization",
    name: "Doc API",
    url: siteUrl,
  },
};

export default function InvoiceGeneratorPage() {
  return (
    <>
      <Script
        id="invoice-generator-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InvoiceGeneratorClient />
    </>
  );
}
