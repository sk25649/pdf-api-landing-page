"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const examples = {
  curl: `curl -X POST https://api.docapi.co/v1/pdf \\
  -H "x-api-key: pk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{"html": "<h1>Hello World</h1>"}' \\
  --output document.pdf`,

  node: `const response = await fetch('https://api.docapi.co/v1/pdf', {
  method: 'POST',
  headers: {
    'x-api-key': 'pk_live_xxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ html: '<h1>Hello World</h1>' })
});

const pdf = await response.arrayBuffer();`,

  python: `import requests

response = requests.post(
    'https://api.docapi.co/v1/pdf',
    headers={'x-api-key': 'pk_live_xxx'},
    json={'html': '<h1>Hello World</h1>'}
)

pdf = response.content`,

  php: `$response = file_get_contents('https://api.docapi.co/v1/pdf', false,
  stream_context_create([
    'http' => [
      'method' => 'POST',
      'header' => "x-api-key: pk_live_xxx\\r\\nContent-Type: application/json",
      'content' => json_encode(['html' => '<h1>Hello World</h1>'])
    ]
  ])
);`,
};

type Language = keyof typeof examples;

export function CodeExample() {
  const [activeTab, setActiveTab] = useState<Language>("curl");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(examples[activeTab]);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Simple integration
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in minutes with your favorite language
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as Language)}
          >
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="node">Node.js</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="php">PHP</TabsTrigger>
            </TabsList>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>

              {Object.entries(examples).map(([lang, code]) => (
                <TabsContent key={lang} value={lang} className="mt-0">
                  <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                    <div className="overflow-x-auto p-4">
                      <pre className="text-sm leading-relaxed">
                        <code className="font-mono text-zinc-100">{code}</code>
                      </pre>
                    </div>
                    <div className="border-t border-zinc-800 px-4 py-2">
                      <span className="text-xs text-zinc-500">
                        → Returns PDF file (application/pdf)
                      </span>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
