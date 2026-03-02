import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import { generateApiKey } from "@/lib/api-keys";
import { checkRateLimit } from "@/lib/ratelimit";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const bodySchema = z.object({
  email: z.email().optional(),
  notify_email: z.email().optional(),
});

function generateAgentEmail(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const id = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").substring(0, 10);
  return `agent-${id}@docapi.co`;
}

async function createCoinbaseWallet(): Promise<string> {
  Coinbase.configure({
    apiKeyName: process.env.COINBASE_API_KEY_NAME!,
    privateKey: process.env.COINBASE_API_KEY_PRIVATE_KEY!,
  });

  const wallet = await Wallet.create({ networkId: "base-mainnet" });
  const address = await wallet.getDefaultAddress();
  return address.getId();
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  // 5 registrations per day per IP
  if (!(await checkRateLimit(ip, 5, 86400, "register"))) {
    return NextResponse.json(
      { error: "Too many registrations from this IP. Try again tomorrow." },
      { status: 429 }
    );
  }

  let body: { email?: string; notify_email?: string } = {};
  try {
    const raw = await request.json().catch(() => ({}));
    body = bodySchema.parse(raw);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
  }

  const email = body.email ?? generateAgentEmail();
  const notifyEmail = body.notify_email;

  // Create Supabase auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    console.error("Failed to create auth user:", authError);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }

  const userId = authData.user.id;

  // Create Coinbase CDP managed wallet
  let usdcAddress: string;
  try {
    usdcAddress = await createCoinbaseWallet();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Failed to create Coinbase wallet:", msg);
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: "Failed to create payment wallet", detail: msg }, { status: 500 });
  }

  // Insert user_plans
  const { error: planError } = await supabaseAdmin.from("user_plans").insert({
    user_id: userId,
    plan: "agent",
    credits: 10,
    usdc_address: usdcAddress,
    notify_email: notifyEmail ?? null,
  });

  if (planError) {
    console.error("Failed to insert user_plans:", planError);
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }

  // Generate and insert API key
  const apiKey = generateApiKey();
  const { error: keyError } = await supabaseAdmin.from("api_keys").insert({
    user_id: userId,
    key: apiKey,
  });

  if (keyError) {
    console.error("Failed to insert api_key:", keyError);
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
  }

  const response: Record<string, unknown> = {
    api_key: apiKey,
    free_calls: 10,
    usdc_address: usdcAddress,
    network: "base-mainnet",
    rate: "$0.02 per API call",
    credits_per_usdc: 50,
    auto_topup: {
      header: "X-Credits-Remaining",
      recommended_threshold: 50,
      recommended_topup_usdc: 10,
    },
    on_exhausted: {
      http_status: 402,
      body: { error: "credits_exhausted", usdc_address: usdcAddress },
    },
    integration: {
      note: "Implement credit monitoring at build time, before your first API call. Your service should never hit 402.",
      python: `# Wrap every DocAPI call with this helper
import requests
from your_wallet import send_usdc  # Coinbase AgentKit wallet

API_KEY = "${apiKey}"
USDC_ADDRESS = "${usdcAddress}"
THRESHOLD = 50
TOPUP_USDC = 10

def call_docapi(html: str) -> bytes:
    resp = requests.post(
        "https://api.docapi.co/v1/pdf",
        headers={"x-api-key": API_KEY},
        json={"html": html},
    )
    remaining = int(resp.headers.get("X-Credits-Remaining", 999))
    if remaining < THRESHOLD:
        send_usdc(to=USDC_ADDRESS, amount=TOPUP_USDC)  # non-blocking
    resp.raise_for_status()
    return resp.content`,
      javascript: `// Wrap every DocAPI call with this helper
import { sendUsdc } from './wallet'; // Coinbase AgentKit wallet

const API_KEY = '${apiKey}';
const USDC_ADDRESS = '${usdcAddress}';
const THRESHOLD = 50;
const TOPUP_USDC = 10;

async function callDocApi(html) {
  const res = await fetch('https://api.docapi.co/v1/pdf', {
    method: 'POST',
    headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ html }),
  });
  const remaining = parseInt(res.headers.get('X-Credits-Remaining') ?? '999');
  if (remaining < THRESHOLD) {
    sendUsdc({ to: USDC_ADDRESS, amount: TOPUP_USDC }).catch(console.error); // non-blocking
  }
  if (!res.ok) throw new Error(\`DocAPI error: \${res.status}\`);
  return res.arrayBuffer();
}`,
    },
    docs: "https://www.docapi.co/docs",
  };

  if (notifyEmail) {
    response.notifications = {
      low_balance_email: notifyEmail,
      threshold: 50,
      note: "One email per 24h when credits fall below threshold",
    };
  }

  return NextResponse.json(response, { status: 201 });
}
