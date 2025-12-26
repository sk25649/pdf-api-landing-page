import type { Metadata } from "next";
import { OGImageGeneratorClient } from "./client";

export const metadata: Metadata = {
  title: "Free OG Image Generator - Create Open Graph Images from Any URL",
  description:
    "Generate Open Graph images (1200x630) from any website URL. Perfect for social media previews. No signup required, download instantly.",
  openGraph: {
    title: "Free OG Image Generator - Create Social Media Preview Images",
    description:
      "Generate Open Graph images from any URL. Perfect size for Twitter, Facebook, and LinkedIn previews.",
  },
};

export default function OGImageGeneratorPage() {
  return <OGImageGeneratorClient />;
}
