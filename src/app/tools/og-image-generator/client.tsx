"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Download,
  Loader2,
  Image,
  Code,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export function OGImageGeneratorClient() {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  async function handleGenerate() {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    // Basic URL validation
    let validUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      validUrl = "https://" + url;
    }

    try {
      new URL(validUrl);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsGenerating(true);
    setPreviewUrl(null);
    setImageBlob(null);

    try {
      const response = await fetch("/api/tools/generate-og-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: validUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate image");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setPreviewUrl(objectUrl);
      setImageBlob(blob);

      toast.success("OG image generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate image"
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleDownload() {
    if (!previewUrl || !imageBlob) return;

    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = `og-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.success("Image downloaded!");
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Free OG Image Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Generate Open Graph images (1200x630) from any URL. Perfect for
            social media previews.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Input Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Image className="h-5 w-5" />
                Enter Website URL
              </CardTitle>
              <CardDescription>
                We&apos;ll capture a screenshot at 1200x630 pixels - the perfect
                size for OG images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="url" className="sr-only">
                    Website URL
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleGenerate();
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="sm:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Image className="h-4 w-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
              <CardDescription>
                1200 x 630 pixels (1.91:1 aspect ratio)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="bg-muted rounded-lg overflow-hidden"
                style={{ aspectRatio: "1200/630" }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Generated OG image"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    {isGenerating ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span>Capturing screenshot...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Image className="h-12 w-12 opacity-50" />
                        <span>Enter a URL and click Generate</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {previewUrl && (
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleDownload}
                    className="flex-1 sm:flex-none"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 sm:flex-none"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        isGenerating ? "animate-spin" : ""
                      }`}
                    />
                    Regenerate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-1">Perfect Size</h3>
                <p className="text-sm text-muted-foreground">
                  1200x630 pixels is the recommended size for Twitter, Facebook,
                  and LinkedIn.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-1">High Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Full-resolution PNG screenshot captured with a real browser
                  engine.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-1">No Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Your URL and generated image are not stored. Privacy first.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Upsell Section */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Need to generate OG images programmatically?
            </h2>
            <p className="text-muted-foreground text-lg">
              Use our Screenshot API to generate OG images dynamically for your
              blog posts, product pages, or any URL.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
                <Code className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Example API Call</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="text-muted-foreground">{`const response = await fetch('https://api.docapi.co/v1/screenshot', {
  method: 'POST',
  headers: {
    'x-api-key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://yoursite.com/blog/my-post',
    options: {
      width: 1200,
      height: 630,
      type: 'png'
    }
  })
});

const ogImage = await response.arrayBuffer();`}</code>
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
                  Free screenshots/month
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">&lt;2s</div>
                <div className="text-sm text-muted-foreground">
                  Average capture time
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
