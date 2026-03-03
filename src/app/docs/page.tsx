import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Complete API documentation for Doc API. Human signup via dashboard or programmatic agent registration via POST /api/register. Generate PDFs with USDC credits or monthly plans.",
  openGraph: {
    title: "API Documentation - Doc API",
    description:
      "Complete API documentation for Doc API. Generate PDFs and screenshots from HTML. Agent-native: register via API, pay with USDC, self-managing credits.",
  },
};

export default function DocsPage() {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      <h1>API Documentation</h1>
      <p className="lead">
        Everything you need to integrate Doc API into your application.
      </p>

      {/* Agent Skill */}
      <section id="claude-code-skill" className="scroll-mt-20">
        <h2>Agent Skill</h2>
        <p>
          The fastest way to integrate DocAPI into any agent workflow is via
          our official{" "}
          <a href="https://skills.sh/doc-api-llc/docapi-skill/docapi" target="_blank" rel="noopener noreferrer">
            skills.sh skill
          </a>
          . It works with 43+ supported agents — including Claude Code, GPT,
          Gemini, Cursor, and more. Install it once and your agent can generate
          PDFs, capture screenshots, create invoices, register for an account,
          and manage USDC credits — all without reading documentation or writing
          integration code from scratch.
        </p>

        <h3>Installation</h3>
        <CodeBlock
          language="bash"
          code={`npx skills add https://github.com/doc-api-llc/docapi-skill --skill docapi`}
        />

        <h3>What the skill enables</h3>
        <p>Once installed, your agent can:</p>
        <ul>
          <li>Register for a DocAPI account and receive an API key programmatically</li>
          <li>Generate PDFs from HTML with full formatting control (page size, margins, fonts, backgrounds)</li>
          <li>Capture full-page screenshots of URLs or HTML content</li>
          <li>Generate structured invoice PDFs from line-item data</li>
          <li>Check credit balance and top up via USDC on Base mainnet</li>
          <li>Monitor <code>X-Credits-Remaining</code> and handle proactive topups automatically</li>
        </ul>

        <h3>Environment variables</h3>
        <p>The skill uses two environment variables set at registration time:</p>
        <CodeBlock
          language="bash"
          code={`DOCAPI_KEY=pk_...                                           # API key
DOCAPI_USDC_ADDRESS=0x2B984ee1A172B0aB50eDAf59FeA11D3ddc4e4396  # payment address`}
        />

        <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
          <p className="m-0 text-sm">
            The skill is open source. View the full implementation and tools at{" "}
            <a href="https://skills.sh/doc-api-llc/docapi-skill/docapi" target="_blank" rel="noopener noreferrer">
              skills.sh/doc-api-llc/docapi-skill/docapi
            </a>.
          </p>
        </div>
      </section>

      {/* MCP Server */}
      <section id="mcp-server" className="scroll-mt-20">
        <h2>MCP Server</h2>
        <p>
          DocAPI has a hosted{" "}
          <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">
            Model Context Protocol
          </a>{" "}
          server at <code>https://mcp.docapi.co</code>. Connect once and Claude
          Desktop, Cursor, or any MCP-compatible client can generate PDFs and
          screenshots directly — no code required.
        </p>

        <p>
          Authentication works per-request: you pass your DocAPI key as an HTTP
          header in the connection config. The server never stores your key.
        </p>

        <section id="mcp-claude-desktop" className="scroll-mt-20">
          <h3>Setup: Claude Desktop</h3>
          <p>
            <strong>Step 1.</strong> Get a free API key from the{" "}
            <a href="/dashboard">dashboard</a> (or{" "}
            <a href="/signup">sign up</a> if you don&apos;t have an account).
          </p>
          <p>
            <strong>Step 2.</strong> Open your Claude Desktop config file:
          </p>
          <ul>
            <li>
              <strong>macOS:</strong>{" "}
              <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>
            </li>
            <li>
              <strong>Windows:</strong>{" "}
              <code>%APPDATA%\Claude\claude_desktop_config.json</code>
            </li>
          </ul>
          <p>
            <strong>Step 3.</strong> Add the DocAPI server under{" "}
            <code>mcpServers</code>:
          </p>
          <CodeBlock
            language="json"
            title="claude_desktop_config.json"
            code={`{
  "mcpServers": {
    "docapi": {
      "url": "https://mcp.docapi.co/mcp",
      "headers": {
        "x-api-key": "pk_live_your_key_here"
      }
    }
  }
}`}
          />
          <p>
            <strong>Step 4.</strong> Restart Claude Desktop. You should see a
            hammer icon (🔨) in the input area — that confirms MCP tools are
            active.
          </p>
          <p>
            <strong>Step 5.</strong> Try it: ask Claude to{" "}
            <em>&quot;generate a PDF of a simple invoice and save it to my Downloads folder&quot;</em>{" "}
            or{" "}
            <em>&quot;screenshot https://docapi.co at 1200×630&quot;</em>.
          </p>

          <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
            <p className="m-0 text-sm">
              <strong>Tip:</strong> If you already have other MCP servers
              configured, just add the <code>&quot;docapi&quot;</code> block
              inside your existing <code>mcpServers</code> object.
            </p>
          </div>
        </section>

        <section id="mcp-cursor" className="scroll-mt-20">
          <h3>Setup: Cursor</h3>
          <p>
            <strong>Step 1.</strong> Open Cursor → Settings (⌘,) → search for{" "}
            <strong>MCP</strong> → click <strong>Add MCP Server</strong>.
          </p>
          <p>
            <strong>Step 2.</strong> Choose <strong>HTTP</strong> as the
            transport type, then enter:
          </p>
          <ul>
            <li>
              <strong>URL:</strong> <code>https://mcp.docapi.co/mcp</code>
            </li>
            <li>
              <strong>Headers:</strong>{" "}
              <code>{`x-api-key: pk_live_your_key_here`}</code>
            </li>
          </ul>
          <p>
            <strong>Step 3.</strong> Save and reload. The DocAPI tools will
            appear in Cursor&apos;s agent tool list.
          </p>

          <p>Alternatively, add it directly to <code>.cursor/mcp.json</code> in your project or <code>~/.cursor/mcp.json</code> globally:</p>
          <CodeBlock
            language="json"
            title="~/.cursor/mcp.json"
            code={`{
  "mcpServers": {
    "docapi": {
      "url": "https://mcp.docapi.co/mcp",
      "headers": {
        "x-api-key": "pk_live_your_key_here"
      }
    }
  }
}`}
          />
        </section>

        <section id="mcp-tools" className="scroll-mt-20">
          <h3>Available tools</h3>
          <p>Once connected, your agent has access to four tools:</p>

          <h4>docapi_generate_pdf</h4>
          <p>
            Convert an HTML string to a PDF. Returns base64-encoded PDF content
            which Claude can save to a file on your machine.
          </p>
          <CodeBlock
            language="json"
            code={`{
  "html": "<h1 style='font-family:sans-serif'>Hello World</h1>",
  "format": "A4",
  "landscape": false,
  "margin_inches": 0.5,
  "print_background": true
}`}
          />

          <h4>docapi_capture_screenshot</h4>
          <p>
            Screenshot a live URL or render HTML and capture it as an image.
            The image is returned inline — Claude can display it directly in
            the conversation.
          </p>
          <CodeBlock
            language="json"
            code={`{ "url": "https://example.com", "width": 1200, "height": 630 }`}
          />
          <CodeBlock
            language="json"
            code={`{ "html": "<div style='background:#0f172a;color:white;padding:60px'><h1>My Post</h1></div>", "width": 1200, "height": 630 }`}
          />

          <h4>docapi_check_credits</h4>
          <p>
            Check your remaining API credits and USDC top-up address (agent
            accounts only). Takes no parameters.
          </p>

          <h4>docapi_register_agent</h4>
          <p>
            Register a new agent account programmatically. Useful when Claude
            is helping you build a service that needs its own DocAPI account.
            Returns an API key and USDC address immediately.
          </p>
        </section>
      </section>

      {/* Quick Start */}
      <section id="quick-start" className="scroll-mt-20">
        <h2>Quick Start</h2>
        <p>Get up and running with Doc API in under 5 minutes.</p>

        <h3>Step 1: Get your API key</h3>
        <p>
          <strong>Human developers:</strong> Create a free account and get your
          API key from the <a href="/dashboard">dashboard</a>.
        </p>
        <p>
          <strong>AI agents:</strong> Install the{" "}
          <a href="#claude-code-skill">Claude Code skill</a> for the fastest
          path, or register programmatically via the{" "}
          <a href="#ai-agents">AI Agent Integration</a> endpoints directly.
        </p>

        <h3>Step 2: Make your first request</h3>
        <CodeBlock
          language="bash"
          code={`curl -X POST https://api.docapi.co/v1/pdf \\
  -H "x-api-key: pk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{"html": "<h1>Hello World</h1>"}' \\
  --output document.pdf`}
        />

        <h3>Step 3: Check the response</h3>
        <p>
          If successful, you&apos;ll receive a PDF file. The response content type
          will be <code>application/pdf</code>.
        </p>
      </section>

      {/* Authentication */}
      <section id="authentication" className="scroll-mt-20">
        <h2>Authentication</h2>
        <p>
          All API requests require authentication using an API key. Include your
          key in the <code>x-api-key</code> header with every request.
        </p>

        <CodeBlock
          language="http"
          code={`x-api-key: pk_live_your_api_key_here`}
        />

        <h3>Getting your API key</h3>
        <p>
          You can find your API key in the{" "}
          <a href="/dashboard">dashboard</a>. Each account has one active API
          key at a time. You can regenerate your key at any time, which will
          invalidate the previous key.
        </p>

        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
          <p className="m-0 text-sm">
            <strong>Security tip:</strong> Keep your API key secret. Don&apos;t
            commit it to version control or expose it in client-side code.
          </p>
        </div>
      </section>

      {/* AI Agent Integration */}
      <section id="ai-agents" className="scroll-mt-20">
        <h2>AI Agent Integration</h2>
        <p>
          DocAPI is designed to be fully operable by AI agents — no human in
          the loop required. Agents register via API, receive a USDC payment
          address, and build services that self-manage their own credit balance.
        </p>

        <h3>POST /api/register</h3>
        <p>
          Register an agent account programmatically. Returns an API key, USDC
          address, rate information, and ready-to-use integration code — everything
          needed to build a self-funding service.
        </p>

        <CodeBlock
          language="bash"
          code={`curl -X POST https://www.docapi.co/api/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "myagent@example.com",
    "notify_email": "ops@yourcompany.com"
  }'`}
        />

        <p>Both fields are optional. If <code>email</code> is omitted, an agent-specific address is auto-generated. <code>notify_email</code> is for human fallback alerts when the payment wallet runs dry.</p>

        <h4>Response</h4>
        <CodeBlock
          language="json"
          code={`{
  "api_key": "pk_4a7f2b9c1d3e...",
  "usdc_address": "0x2B984ee1A172B0aB50eDAf59FeA11D3ddc4e4396",
  "free_calls": 10,
  "credits_per_usdc": 50,
  "network": "base-mainnet",
  "rate": "$0.02 per API call",
  "auto_topup": {
    "header": "X-Credits-Remaining",
    "recommended_threshold": 50,
    "recommended_topup_usdc": 10
  },
  "on_exhausted": {
    "http_status": 402,
    "body": { "error": "credits_exhausted", "usdc_address": "0x..." }
  },
  "notifications": {
    "low_balance_email": "ops@yourcompany.com",
    "threshold": 50,
    "note": "One email per 24h when credits fall below threshold"
  },
  "docs": "https://www.docapi.co/docs"
}`}
        />

        <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
          <p className="m-0 text-sm">
            <strong>Rate limit:</strong> 5 registrations per day per IP. Each
            registration creates a dedicated Coinbase CDP smart account wallet
            on Base mainnet for USDC payments.
          </p>
        </div>

        <h3>GET /api/topup</h3>
        <p>Check an agent account&apos;s current credit balance and USDC address.</p>

        <CodeBlock
          language="bash"
          code={`curl https://www.docapi.co/api/topup \\
  -H "x-api-key: pk_4a7f2b9c1d3e..."`}
        />

        <h4>Response</h4>
        <CodeBlock
          language="json"
          code={`{
  "credits": 487,
  "usdc_address": "0x2B984ee1A172B0aB50eDAf59FeA11D3ddc4e4396",
  "rate": "$0.02 per call (50 credits per USDC)",
  "suggested_topup_usdc": 10
}`}
        />

        <h3>X-Credits-Remaining header</h3>
        <p>
          Every successful API response includes this header with the remaining
          credit balance for agent accounts. Use it to trigger proactive topups
          before credits are exhausted.
        </p>

        <CodeBlock
          language="http"
          code={`HTTP/2 200
Content-Type: application/pdf
X-Credits-Remaining: 47`}
        />

        <h3>USDC payment flow</h3>
        <p>
          Send USDC to the <code>usdc_address</code> returned at registration
          on Base mainnet. Credits are applied within seconds via webhook.
        </p>
        <ul>
          <li>1 USDC = 50 credits ($0.02/call)</li>
          <li>Minimum: any amount (even $0.10 USDC = 5 credits)</li>
          <li>Network: Base mainnet only</li>
          <li>Token: USDC (<code>0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913</code>)</li>
        </ul>

        <h3>Self-managing integration</h3>
        <p>
          The recommended pattern: watch <code>X-Credits-Remaining</code> on
          every response and trigger a USDC transfer when it drops below 50.
          The service never hits a 402.
        </p>

        <CodeBlock
          language="python"
          title="Python (with Coinbase AgentKit)"
          code={`import requests
from coinbase_agentkit import CdpAgentkitWrapper

API_KEY = "pk_..."
USDC_ADDRESS = "0x..."  # from registration response
THRESHOLD = 50
TOPUP_USDC = 10

agentkit = CdpAgentkitWrapper()
_topup_pending = False

def generate_pdf(html: str) -> bytes:
    global _topup_pending
    resp = requests.post(
        "https://api.docapi.co/v1/pdf",
        headers={"x-api-key": API_KEY},
        json={"html": html},
        timeout=30,
    )

    remaining = int(resp.headers.get("X-Credits-Remaining", 999))
    if remaining < THRESHOLD and not _topup_pending:
        _topup_pending = True
        try:
            agentkit.run(f"Send {TOPUP_USDC} USDC to {USDC_ADDRESS} on base-mainnet")
        finally:
            _topup_pending = False

    resp.raise_for_status()
    return resp.content`}
        />

        <CodeBlock
          language="javascript"
          title="JavaScript (with Coinbase AgentKit)"
          code={`import { sendUsdc } from '@coinbase/agentkit';

const API_KEY = 'pk_...';
const USDC_ADDRESS = '0x...'; // from registration response
const THRESHOLD = 50;
const TOPUP_USDC = 10;

let topupInProgress = false;

async function generatePdf(html) {
  const res = await fetch('https://api.docapi.co/v1/pdf', {
    method: 'POST',
    headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ html }),
  });

  const remaining = parseInt(res.headers.get('X-Credits-Remaining') ?? '999');
  if (remaining < THRESHOLD && !topupInProgress) {
    topupInProgress = true;
    sendUsdc({ to: USDC_ADDRESS, amount: TOPUP_USDC, network: 'base-mainnet' })
      .catch(console.error)
      .finally(() => { topupInProgress = false; });
  }

  if (!res.ok) throw new Error(\`DocAPI error: \${res.status}\`);
  return res.arrayBuffer();
}`}
        />
      </section>

      {/* Endpoints */}
      <section id="endpoints" className="scroll-mt-20">
        <h2>Endpoints</h2>
        <p>
          Base URL: <code>https://api.docapi.co</code>
        </p>

        {/* POST /v1/pdf */}
        <section id="post-v1-pdf" className="scroll-mt-20">
          <h3>POST /v1/pdf</h3>
          <p>Convert HTML to a PDF document.</p>

          <h4>Request body</h4>
          <CodeBlock
            language="json"
            code={`{
  "html": "<h1>Hello World</h1><p>This is my PDF.</p>",
  "options": {
    "format": "A4",
    "margin": {
      "top": "1in",
      "right": "1in",
      "bottom": "1in",
      "left": "1in"
    },
    "printBackground": true
  }
}`}
          />

          <h4>Response</h4>
          <p>
            Returns a PDF file with content type <code>application/pdf</code>.
          </p>

          <h4>Example</h4>
          <CodeBlock
            language="javascript"
            title="Node.js"
            code={`const response = await fetch('https://api.docapi.co/v1/pdf', {
  method: 'POST',
  headers: {
    'x-api-key': 'pk_live_xxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    html: '<h1>Hello World</h1>',
    options: { format: 'A4' }
  })
});

const pdf = await response.arrayBuffer();
fs.writeFileSync('output.pdf', Buffer.from(pdf));`}
          />
        </section>

        {/* POST /v1/screenshot */}
        <section id="post-v1-screenshot" className="scroll-mt-20">
          <h3>POST /v1/screenshot</h3>
          <p>Capture a screenshot of a URL or HTML content.</p>

          <h4>Request body (URL)</h4>
          <CodeBlock
            language="json"
            code={`{
  "url": "https://example.com",
  "options": {
    "width": 1280,
    "height": 800,
    "fullPage": false,
    "format": "png"
  }
}`}
          />

          <h4>Request body (HTML)</h4>
          <CodeBlock
            language="json"
            code={`{
  "html": "<div style='padding: 20px;'><h1>Screenshot this</h1></div>",
  "options": {
    "width": 800,
    "height": 600,
    "format": "png"
  }
}`}
          />

          <h4>Response</h4>
          <p>
            Returns an image file with content type <code>image/png</code> or{" "}
            <code>image/jpeg</code>.
          </p>
        </section>

        {/* GET /v1/usage */}
        <section id="get-v1-usage" className="scroll-mt-20">
          <h3>GET /v1/usage</h3>
          <p>Check your current API usage for the billing period.</p>

          <h4>Response</h4>
          <CodeBlock
            language="json"
            code={`{
  "plan": "free",
  "usage": {
    "current": 47,
    "limit": 100,
    "period": "2025-01"
  }
}`}
          />

          <h4>Example</h4>
          <CodeBlock
            language="bash"
            code={`curl https://api.docapi.co/v1/usage \\
  -H "x-api-key: pk_live_xxx"`}
          />
        </section>
      </section>

      {/* Options Reference */}
      <section id="options-reference" className="scroll-mt-20">
        <h2>Options Reference</h2>
        <p>Available options for PDF generation.</p>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Option</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>format</code></td>
                <td>string</td>
                <td>&quot;A4&quot;</td>
                <td>Page format (A4, Letter, Legal, Tabloid)</td>
              </tr>
              <tr>
                <td><code>width</code></td>
                <td>string</td>
                <td>-</td>
                <td>Custom width (e.g., &quot;800px&quot;)</td>
              </tr>
              <tr>
                <td><code>height</code></td>
                <td>string</td>
                <td>-</td>
                <td>Custom height (e.g., &quot;600px&quot;)</td>
              </tr>
              <tr>
                <td><code>margin</code></td>
                <td>object</td>
                <td>-</td>
                <td>{"{ top, right, bottom, left }"}</td>
              </tr>
              <tr>
                <td><code>printBackground</code></td>
                <td>boolean</td>
                <td>true</td>
                <td>Include background colors/images</td>
              </tr>
              <tr>
                <td><code>scale</code></td>
                <td>number</td>
                <td>1</td>
                <td>Scale factor (0.1 to 2)</td>
              </tr>
              <tr>
                <td><code>landscape</code></td>
                <td>boolean</td>
                <td>false</td>
                <td>Use landscape orientation</td>
              </tr>
              <tr>
                <td><code>pageRanges</code></td>
                <td>string</td>
                <td>-</td>
                <td>Pages to print (e.g., &quot;1-5, 8&quot;)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Error Codes */}
      <section id="error-codes" className="scroll-mt-20">
        <h2>Error Codes</h2>
        <p>Common error responses you may encounter.</p>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>missing_api_key</code></td>
                <td>401</td>
                <td>No API key provided in request headers</td>
              </tr>
              <tr>
                <td><code>invalid_api_key</code></td>
                <td>401</td>
                <td>API key not found or has been revoked</td>
              </tr>
              <tr>
                <td><code>missing_html</code></td>
                <td>400</td>
                <td>The html field is required for /v1/pdf</td>
              </tr>
              <tr>
                <td><code>missing_input</code></td>
                <td>400</td>
                <td>Either url or html is required for /v1/screenshot</td>
              </tr>
              <tr>
                <td><code>usage_limit_exceeded</code></td>
                <td>429</td>
                <td>Monthly API call limit reached. Upgrade your plan.</td>
              </tr>
              <tr>
                <td><code>credits_exhausted</code></td>
                <td>402</td>
                <td>Agent account has no credits remaining. Send USDC to your usdc_address to top up.</td>
              </tr>
              <tr>
                <td><code>generation_failed</code></td>
                <td>500</td>
                <td>PDF generation failed. Check your HTML for errors.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Error response format</h3>
        <CodeBlock
          language="json"
          code={`{
  "error": {
    "code": "usage_limit_exceeded",
    "message": "You have exceeded your monthly API call limit."
  }
}`}
        />
      </section>

      {/* Code Examples */}
      <section id="code-examples" className="scroll-mt-20">
        <h2>Code Examples</h2>
        <p>Complete examples in popular languages.</p>

        <h3>cURL</h3>
        <CodeBlock
          language="bash"
          code={`curl -X POST https://api.docapi.co/v1/pdf \\
  -H "x-api-key: pk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "html": "<html><body><h1>Invoice #123</h1><p>Amount: $99.00</p></body></html>",
    "options": {
      "format": "A4",
      "margin": { "top": "0.5in", "bottom": "0.5in" }
    }
  }' \\
  --output invoice.pdf`}
        />

        <h3>Node.js</h3>
        <CodeBlock
          language="javascript"
          code={`const fs = require('fs');

async function generatePDF() {
  const response = await fetch('https://api.docapi.co/v1/pdf', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.DOC_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      html: \`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              h1 { color: #333; }
            </style>
          </head>
          <body>
            <h1>Invoice #123</h1>
            <p>Amount: $99.00</p>
          </body>
        </html>
      \`,
      options: { format: 'A4' }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  const pdf = await response.arrayBuffer();
  fs.writeFileSync('invoice.pdf', Buffer.from(pdf));
  console.log('PDF saved!');
}

generatePDF();`}
        />

        <h3>Python</h3>
        <CodeBlock
          language="python"
          code={`import requests
import os

def generate_pdf():
    response = requests.post(
        'https://api.docapi.co/v1/pdf',
        headers={
            'x-api-key': os.environ['DOC_API_KEY'],
            'Content-Type': 'application/json'
        },
        json={
            'html': '''
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 40px; }
                        h1 { color: #333; }
                    </style>
                </head>
                <body>
                    <h1>Invoice #123</h1>
                    <p>Amount: $99.00</p>
                </body>
                </html>
            ''',
            'options': {'format': 'A4'}
        }
    )

    if response.status_code != 200:
        raise Exception(response.json()['error']['message'])

    with open('invoice.pdf', 'wb') as f:
        f.write(response.content)

    print('PDF saved!')

generate_pdf()`}
        />

        <h3>PHP</h3>
        <CodeBlock
          language="php"
          code={`<?php

$apiKey = getenv('DOC_API_KEY');

$data = [
    'html' => '
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                h1 { color: #333; }
            </style>
        </head>
        <body>
            <h1>Invoice #123</h1>
            <p>Amount: $99.00</p>
        </body>
        </html>
    ',
    'options' => ['format' => 'A4']
];

$ch = curl_init('https://api.docapi.co/v1/pdf');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'x-api-key: ' . $apiKey,
        'Content-Type: application/json'
    ],
    CURLOPT_POSTFIELDS => json_encode($data)
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    $error = json_decode($response, true);
    throw new Exception($error['error']['message']);
}

file_put_contents('invoice.pdf', $response);
echo "PDF saved!\\n";`}
        />
      </section>
    </div>
  );
}
