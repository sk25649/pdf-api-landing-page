import { CodeBlock } from "@/components/docs/CodeBlock";

export default function DocsPage() {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      <h1>API Documentation</h1>
      <p className="lead">
        Everything you need to integrate Doc API into your application.
      </p>

      {/* Quick Start */}
      <section id="quick-start" className="scroll-mt-20">
        <h2>Quick Start</h2>
        <p>Get up and running with Doc API in under 5 minutes.</p>

        <h3>Step 1: Sign up and get your API key</h3>
        <p>
          Create a free account and get your API key from the{" "}
          <a href="/dashboard">dashboard</a>.
        </p>

        <h3>Step 2: Make your first request</h3>
        <CodeBlock
          language="bash"
          code={`curl -X POST https://api.docapi.io/v1/pdf \\
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

      {/* Endpoints */}
      <section id="endpoints" className="scroll-mt-20">
        <h2>Endpoints</h2>
        <p>
          Base URL: <code>https://api.docapi.io</code>
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
            code={`const response = await fetch('https://api.docapi.io/v1/pdf', {
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
            code={`curl https://api.docapi.io/v1/usage \\
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
          code={`curl -X POST https://api.docapi.io/v1/pdf \\
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
  const response = await fetch('https://api.docapi.io/v1/pdf', {
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
        'https://api.docapi.io/v1/pdf',
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

$ch = curl_init('https://api.docapi.io/v1/pdf');
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
