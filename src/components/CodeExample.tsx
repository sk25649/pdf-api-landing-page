"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
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

  agent: `from langchain.tools import tool
import requests

# Step 1: Agent self-registers (no email, no dashboard)
reg = requests.post('https://api.docapi.co/api/register').json()
api_key = reg['api_key']
print(f"Credits remaining: {reg['credits']}")  # 3 free calls (10 if email provided)

@tool
def generate_pdf(html: str) -> bytes:
    """Convert HTML to PDF. Returns raw PDF bytes."""
    res = requests.post(
        'https://api.docapi.co/v1/pdf',
        headers={'x-api-key': api_key},
        json={'html': html}
    )
    credits_left = res.headers.get('X-Credits-Remaining')
    print(f"Credits remaining: {credits_left}")
    return res.content

# Step 2: Use in a LangChain agent
from langchain_anthropic import ChatAnthropic
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate

llm = ChatAnthropic(model='claude-3-5-sonnet-20241022')
prompt = ChatPromptTemplate.from_messages([
    ('system', 'You generate professional PDF reports.'),
    ('human', '{input}'),
    ('placeholder', '{agent_scratchpad}'),
])

agent = create_tool_calling_agent(llm, [generate_pdf], prompt)
executor = AgentExecutor(agent=agent, tools=[generate_pdf])

result = executor.invoke({
    'input': 'Generate a Q4 market summary PDF for zip code 90210'
})`,
};

type Language = keyof typeof examples;

const languageMap: Record<Language, string> = {
  curl: "bash",
  node: "javascript",
  python: "python",
  php: "php",
  agent: "python",
};

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
              <TabsTrigger value="agent">
                <span className="flex items-center gap-1.5">
                  🤖 AI Agent
                </span>
              </TabsTrigger>
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
                      <Highlight
                        theme={themes.nightOwl}
                        code={code}
                        language={languageMap[lang as Language]}
                      >
                        {({ style, tokens, getLineProps, getTokenProps }) => (
                          <pre
                            className="text-sm leading-relaxed font-mono"
                            style={{ ...style, background: "transparent" }}
                          >
                            {tokens.map((line, i) => (
                              <div key={i} {...getLineProps({ line })}>
                                {line.map((token, key) => (
                                  <span
                                    key={key}
                                    {...getTokenProps({ token })}
                                  />
                                ))}
                              </div>
                            ))}
                          </pre>
                        )}
                      </Highlight>
                    </div>
                    <div className="border-t border-zinc-800 px-4 py-2">
                      <span className="text-xs text-zinc-500">
                        {lang === "agent"
                          ? "→ Agent self-registers, generates PDFs, monitors credits autonomously"
                          : "→ Returns PDF file (application/pdf)"}
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
