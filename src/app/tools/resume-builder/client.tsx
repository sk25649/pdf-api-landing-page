"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Code, ArrowRight } from "lucide-react";
import { ResumeForm } from "./components/ResumeForm";
import { ResumePreview } from "./components/ResumePreview";
import {
  resumeSchema,
  ResumeFormData,
  defaultResumeValues,
} from "./types";

const STORAGE_KEY = "docapi-resume-builder-data";

export function ResumeBuilderClient() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const form = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: defaultResumeValues,
    mode: "onChange",
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
      }
    } catch (error) {
      console.error("Failed to load saved data:", error);
    }
    setIsHydrated(true);
  }, [form]);

  // Auto-save to localStorage
  const watchedValues = form.watch();

  useEffect(() => {
    if (!isHydrated) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchedValues));
      } catch (error) {
        console.error("Failed to save data:", error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [watchedValues, isHydrated]);

  const handleClearForm = useCallback(() => {
    form.reset(defaultResumeValues);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Form cleared");
  }, [form]);

  async function handleDownload() {
    const data = form.getValues();

    // Basic validation
    if (!data.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!data.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/tools/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate resume");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = data.fullName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      a.download = `resume-${safeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Resume downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate resume"
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
            Free Resume Builder
          </h1>
          <p className="text-muted-foreground text-lg">
            Build your professional resume in minutes. No signup required.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <ResumeForm form={form} />

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sticky bottom-4 lg:static">
              <Button
                onClick={handleDownload}
                disabled={isGenerating}
                size="lg"
                className="flex-1 sm:flex-none"
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
              <Button
                onClick={handleClearForm}
                variant="outline"
                size="lg"
              >
                Clear Form
              </Button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Your data is auto-saved in your browser. Nothing is sent to our servers until you download.
            </p>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Preview</h2>
              <p className="text-sm text-muted-foreground">
                Live preview of your resume
              </p>
            </div>
            <div className="rounded-lg border bg-gray-100 p-4 overflow-hidden">
              <ResumePreview data={form.watch()} />
            </div>
          </div>
        </div>
      </div>

      {/* Upsell Section */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Need to generate resumes at scale?
            </h2>
            <p className="text-muted-foreground text-lg">
              Integrate with our API to generate unlimited PDF resumes
              programmatically. Perfect for job boards, HR platforms, and
              recruitment systems.
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
    html: resumeHTML,
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
