import type { Metadata } from "next";
import Script from "next/script";
import { OGImageGeneratorClient } from "./client";

const siteUrl = "https://www.docapi.co";
const toolUrl = `${siteUrl}/tools/og-image-generator`;

export const metadata: Metadata = {
  title: "Free OG Image Generator - Create Open Graph Images from Any URL",
  description:
    "Generate Open Graph images (1200x630) from any website URL. Perfect for social media previews. No signup required, download instantly.",
  alternates: {
    canonical: toolUrl,
  },
  openGraph: {
    title: "Free OG Image Generator - Create Social Media Preview Images",
    description:
      "Generate Open Graph images from any URL. Perfect size for Twitter, Facebook, and LinkedIn previews.",
    url: toolUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free OG Image Generator",
  url: toolUrl,
  description:
    "Generate Open Graph images (1200x630) from any website URL. Perfect for social media previews.",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "1200x630 OG image generation",
    "Screenshot from any URL",
    "Instant download",
    "No signup required",
    "Twitter, Facebook, LinkedIn compatible",
  ],
  provider: {
    "@type": "Organization",
    name: "Doc API",
    url: siteUrl,
  },
};

export default function OGImageGeneratorPage() {
  return (
    <>
      <Script
        id="og-image-generator-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OGImageGeneratorClient />
    </>
  );
}
