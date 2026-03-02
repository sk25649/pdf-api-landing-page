import type { Metadata } from "next";
import Script from "next/script";
import { ResumeBuilderClient } from "./client";

const siteUrl = "https://www.docapi.co";
const toolUrl = `${siteUrl}/tools/resume-builder`;

export const metadata: Metadata = {
  title: "Free Resume Builder - Create Professional PDF Resumes | DocAPI",
  description:
    "Build your professional resume for free. No signup required. Live preview as you type, download as PDF instantly.",
  alternates: {
    canonical: toolUrl,
  },
  openGraph: {
    title: "Free Resume Builder - Create Professional PDF Resumes",
    description:
      "Build your professional resume for free. No signup required. Download instantly as PDF.",
    url: toolUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Resume Builder",
  url: toolUrl,
  description:
    "Build your professional resume for free. Live preview as you type, download as PDF instantly.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Professional PDF resume generation",
    "Live preview",
    "Work experience and education sections",
    "Skills and languages",
    "Instant download",
    "No signup required",
  ],
  provider: {
    "@type": "Organization",
    name: "Doc API",
    url: siteUrl,
  },
};

export default function ResumeBuilderPage() {
  return (
    <>
      <Script
        id="resume-builder-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResumeBuilderClient />
    </>
  );
}
