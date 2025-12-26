import type { Metadata } from "next";
import { ResumeBuilderClient } from "./client";

export const metadata: Metadata = {
  title: "Free Resume Builder - Create Professional PDF Resumes | DocAPI",
  description:
    "Build your professional resume for free. No signup required. Live preview as you type, download as PDF instantly.",
  openGraph: {
    title: "Free Resume Builder - Create Professional PDF Resumes",
    description:
      "Build your professional resume for free. No signup required. Download instantly as PDF.",
  },
};

export default function ResumeBuilderPage() {
  return <ResumeBuilderClient />;
}
