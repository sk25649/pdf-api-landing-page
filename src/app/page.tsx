import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CodeExample } from "@/components/CodeExample";
import { PricingTable } from "@/components/PricingTable";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-12 md:flex-row md:gap-16">
            {/* Left column - Text content */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium">
                <span className="mr-2">🚀</span>
                Developer-first PDF API
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                HTML to PDF API{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  for developers
                </span>
              </h1>

              <p className="mb-8 max-w-lg text-lg text-muted-foreground md:text-xl">
                Generate PDFs in seconds. Simple API, fair pricing. No complex
                setup, no headaches.
              </p>

              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/docs">View Documentation</Link>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Free tier includes 100 API calls/month. No credit card required.
              </p>
            </div>

            {/* Right column - Code preview */}
            <div className="w-full flex-1 md:w-auto">
              <div className="overflow-hidden rounded-xl border bg-zinc-950 shadow-2xl">
                <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-zinc-500">request.js</span>
                </div>
                <div className="overflow-x-auto p-4">
                  <pre className="text-sm leading-relaxed">
                    <code>
                      <span className="text-zinc-500">
                        {"// Generate a PDF from HTML"}
                      </span>
                      {"\n"}
                      <span className="text-purple-400">const</span>
                      <span className="text-zinc-100"> response </span>
                      <span className="text-purple-400">= await </span>
                      <span className="text-yellow-300">fetch</span>
                      <span className="text-zinc-100">(</span>
                      <span className="text-green-400">
                        &quot;https://api.docapi.co/v1/pdf&quot;
                      </span>
                      <span className="text-zinc-100">, {"{"}</span>
                      {"\n"}
                      <span className="text-zinc-100">{"  "}method: </span>
                      <span className="text-green-400">&quot;POST&quot;</span>
                      <span className="text-zinc-100">,</span>
                      {"\n"}
                      <span className="text-zinc-100">
                        {"  "}headers: {"{"}
                      </span>
                      {"\n"}
                      <span className="text-zinc-100">{"    "}</span>
                      <span className="text-green-400">
                        &quot;x-api-key&quot;
                      </span>
                      <span className="text-zinc-100">: </span>
                      <span className="text-green-400">
                        &quot;pk_live_xxx&quot;
                      </span>
                      <span className="text-zinc-100">,</span>
                      {"\n"}
                      <span className="text-zinc-100">{"    "}</span>
                      <span className="text-green-400">
                        &quot;Content-Type&quot;
                      </span>
                      <span className="text-zinc-100">: </span>
                      <span className="text-green-400">
                        &quot;application/json&quot;
                      </span>
                      <span className="text-zinc-100">,</span>
                      {"\n"}
                      <span className="text-zinc-100">{"  },"}</span>
                      {"\n"}
                      <span className="text-zinc-100">{"  "}body: </span>
                      <span className="text-yellow-300">JSON</span>
                      <span className="text-zinc-100">.</span>
                      <span className="text-yellow-300">stringify</span>
                      <span className="text-zinc-100">({"{"}</span>
                      {"\n"}
                      <span className="text-zinc-100">{"    "}html: </span>
                      <span className="text-green-400">
                        &quot;&lt;h1&gt;Hello World&lt;/h1&gt;&quot;
                      </span>
                      <span className="text-zinc-100">,</span>
                      {"\n"}
                      <span className="text-zinc-100">{"  }),"}</span>
                      {"\n"}
                      <span className="text-zinc-100">{"});"}</span>
                    </code>
                  </pre>
                </div>
                <div className="border-t border-zinc-800 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-zinc-400">
                      Response: PDF file (application/pdf)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples Section */}
      <CodeExample />

      {/* Pricing Section */}
      <PricingTable />
    </main>
  );
}
