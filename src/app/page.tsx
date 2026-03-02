import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Zap, CreditCard, Activity } from "lucide-react";
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
                <span className="mr-2">🤖</span>
                Agent-native PDF API
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                HTML to PDF API for{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  developers and AI agents
                </span>
              </h1>

              <p className="mb-8 max-w-lg text-lg text-muted-foreground md:text-xl">
                Generate PDFs in seconds. Register programmatically, pay with
                USDC, monitor credits per-response. No dashboards required.
              </p>

              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/docs#ai-agents">Agent Docs</Link>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Humans: 100 calls/month free. AI agents: 10 free calls via{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  POST /api/register
                </code>
                . No credit card required.
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

      {/* AI Agent Section */}
      <section className="border-t py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium">
              <Bot className="mr-2 h-4 w-4" />
              Built for AI agents
            </div>
            <h2 className="mb-4 text-3xl font-bold">
              Your agent registers. Your software runs forever.
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              One POST request gives an agent everything it needs to build
              self-funding PDF generation into the software it&apos;s building.
              No dashboards, no credit cards, no human in the loop.
            </p>
          </div>

          {/* Skills.sh callout */}
          <div className="mx-auto mb-10 max-w-6xl rounded-xl border bg-muted/40 px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">
                  The Agent Skill — works with 43+ agents
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Claude Code, GPT, Gemini, Cursor, and more. Install once and your agent can register, generate PDFs, and manage USDC credits without writing any integration code.
                </p>
              </div>
              <div className="shrink-0">
                <code className="block rounded-lg border bg-zinc-950 px-4 py-2 text-sm text-green-400 whitespace-nowrap">
                  npx skills add docapi
                </code>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Published on{" "}
              <a
                href="https://skills.sh/doc-api-llc/docapi-skill/docapi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                skills.sh/doc-api-llc/docapi-skill/docapi
              </a>
            </div>
          </div>

          <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
            {/* Feature list */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Register via API, no browser</h3>
                  <p className="text-sm text-muted-foreground">
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">POST /api/register</code> returns
                    an API key and USDC address in one response. No email
                    confirmation, no dashboard, no human step required.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Pay with USDC on Base</h3>
                  <p className="text-sm text-muted-foreground">
                    Agents don&apos;t have credit cards — they have crypto wallets.
                    Send USDC to your dedicated address on Base mainnet. Credits
                    appear in seconds via webhook. 50 credits per 1 USDC
                    ($0.02/call).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">
                    <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">X-Credits-Remaining</code> on every response
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Every API response includes a credit balance header. Software
                    watches this header and sends USDC proactively when it drops
                    below 50. The 402 never happens.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">10 free calls on registration</h3>
                  <p className="text-sm text-muted-foreground">
                    Test the API before committing to payment setup. Enough to
                    validate output quality and integration correctness — then
                    fund and go.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button asChild variant="outline">
                  <Link href="/docs#ai-agents">
                    Read the agent docs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Registration response preview */}
            <div className="overflow-hidden rounded-xl border bg-zinc-950 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-zinc-500">
                  POST /api/register → 201
                </span>
              </div>
              <div className="overflow-x-auto p-4">
                <pre className="text-xs leading-relaxed text-zinc-300">
                  <code>{`{
  `}<span className="text-green-400">&quot;api_key&quot;</span>{`: `}<span className="text-yellow-300">&quot;pk_4a7f2b9c...&quot;</span>{`,
  `}<span className="text-green-400">&quot;usdc_address&quot;</span>{`: `}<span className="text-yellow-300">&quot;0x2B984ee1...&quot;</span>{`,
  `}<span className="text-green-400">&quot;free_calls&quot;</span>{`: `}<span className="text-purple-400">10</span>{`,
  `}<span className="text-green-400">&quot;credits_per_usdc&quot;</span>{`: `}<span className="text-purple-400">50</span>{`,
  `}<span className="text-green-400">&quot;network&quot;</span>{`: `}<span className="text-yellow-300">&quot;base-mainnet&quot;</span>{`,
  `}<span className="text-green-400">&quot;rate&quot;</span>{`: `}<span className="text-yellow-300">&quot;$0.02 per API call&quot;</span>{`,
  `}<span className="text-green-400">&quot;auto_topup&quot;</span>{`: {
    `}<span className="text-green-400">&quot;header&quot;</span>{`: `}<span className="text-yellow-300">&quot;X-Credits-Remaining&quot;</span>{`,
    `}<span className="text-green-400">&quot;recommended_threshold&quot;</span>{`: `}<span className="text-purple-400">50</span>{`,
    `}<span className="text-green-400">&quot;recommended_topup_usdc&quot;</span>{`: `}<span className="text-purple-400">10</span>{`
  },
  `}<span className="text-green-400">&quot;on_exhausted&quot;</span>{`: {
    `}<span className="text-green-400">&quot;http_status&quot;</span>{`: `}<span className="text-purple-400">402</span>{`,
    `}<span className="text-green-400">&quot;body&quot;</span>{`: { `}<span className="text-green-400">&quot;error&quot;</span>{`: `}<span className="text-yellow-300">&quot;credits_exhausted&quot;</span>{` }
  },
  `}<span className="text-green-400">&quot;integration&quot;</span>{`: {
    `}<span className="text-zinc-500">{`// Python + JS snippets with topup loop`}</span>{`
  }
}`}</code>
                </pre>
              </div>
              <div className="border-t border-zinc-800 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs text-zinc-400">
                    Everything the agent needs to self-manage billing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingTable />
    </main>
  );
}
