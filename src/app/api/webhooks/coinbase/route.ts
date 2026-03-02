import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { LoopsClient } from "loops";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// USDC on Base mainnet has 6 decimal places
const USDC_DECIMALS = 6;
const CREDITS_PER_USDC = 50;
const LOW_BALANCE_THRESHOLD = 50;

// Verifies the X-Hook0-Signature header from Coinbase CDP Onchain Webhooks.
// Header format: t=<timestamp>,h=<space-delimited header names>,v1=<hmac-sha256-hex>
// Signed payload: {timestamp}.{headerNames}.{headerValues}.{rawBody}
async function verifySignature(
  body: string,
  sigHeader: string,
  requestHeaders: Headers
): Promise<boolean> {
  const secret = process.env.COINBASE_WEBHOOK_SECRET;
  if (!secret) return false;

  // Parse header components
  const parts = Object.fromEntries(
    sigHeader.split(",").map((p) => p.split("=", 2) as [string, string])
  );
  const timestamp = parts["t"];
  const headerNames = parts["h"]; // space-delimited
  const providedSig = parts["v1"];

  if (!timestamp || !headerNames || !providedSig) return false;

  // Build the signed payload string
  const headerNamesArr = headerNames.split(" ");
  const headerValues = headerNamesArr.map((h) => requestHeaders.get(h) ?? "").join(".");
  const signedPayload = `${timestamp}.${headerNames}.${headerValues}.${body}`;

  // Compute HMAC-SHA256
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison
  if (expected.length !== providedSig.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ providedSig.charCodeAt(i);
  }
  return mismatch === 0;
}

async function sendLowBalanceEmail(
  notifyEmail: string,
  credits: number,
  usdcAddress: string
): Promise<void> {
  const apiKey = process.env.LOOPS_API_KEY;
  const templateId = process.env.LOOPS_LOW_CREDITS_TEMPLATE_ID;
  if (!apiKey || !templateId) return;

  const loops = new LoopsClient(apiKey);
  await loops.sendTransactionalEmail({
    transactionalId: templateId,
    email: notifyEmail,
    dataVariables: {
      credits: credits.toString(),
      usdc_address: usdcAddress,
      topup_usdc: "10",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();

  // Coinbase CDP Onchain Webhooks use X-Hook0-Signature
  const sigHeader = headersList.get("x-hook0-signature") ?? "";

  if (!sigHeader || !(await verifySignature(body, sigHeader, request.headers))) {
    console.error("Invalid Coinbase webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Coinbase CDP Onchain Webhook payload (Smart Contract Events / Transfer)
  //
  // {
  //   id: "...",
  //   type: "onchain.activity.detected",
  //   createdAt: "...",
  //   data: {
  //     subscriptionId: "...",
  //     networkId: "base-mainnet",
  //     transactionHash: "0x...",
  //     contractAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  //     eventName: "Transfer",
  //     from: "0x...",
  //     to: "0x...",     ← our wallet address
  //     value: "1000000" ← USDC amount (6 decimals)
  //   }
  // }
  //
  // Also supports simplified format for local testing: { walletAddress, amount_usdc }

  let toAddress: string | undefined;
  let amountUsdc: number | undefined;

  const data = payload.data as Record<string, unknown> | undefined;

  if (data && typeof data.to === "string" && typeof data.value === "string") {
    // CDP Onchain Webhook format
    toAddress = data.to.toLowerCase();
    const rawValue = parseInt(data.value, 10);
    amountUsdc = rawValue / Math.pow(10, USDC_DECIMALS);
  } else if (typeof payload.amount_usdc === "number") {
    // Simplified format for local testing
    amountUsdc = payload.amount_usdc;
    if (typeof payload.walletAddress === "string") {
      toAddress = (payload.walletAddress as string).toLowerCase();
    }
  }

  if (!toAddress || !amountUsdc || amountUsdc <= 0) {
    console.error("Could not parse USDC amount or recipient address from webhook payload");
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Look up user_plans by usdc_address
  const { data: plan, error: planError } = await supabaseAdmin
    .from("user_plans")
    .select("user_id, credits, usdc_address, notify_email, low_balance_notified_at")
    .ilike("usdc_address", toAddress)
    .single();

  if (planError || !plan) {
    console.error("No user found for USDC address:", toAddress);
    return NextResponse.json({ error: "Unknown wallet address" }, { status: 404 });
  }

  const newCredits = Math.floor(amountUsdc * CREDITS_PER_USDC);
  const updatedCredits = plan.credits + newCredits;

  // Credit the account and reset the low-balance notification flag
  const { error: updateError } = await supabaseAdmin
    .from("user_plans")
    .update({
      credits: updatedCredits,
      low_balance_notified_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", plan.user_id);

  if (updateError) {
    console.error("Failed to update credits:", updateError);
    return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
  }

  console.log(
    `Credited ${newCredits} credits to user ${plan.user_id} ` +
    `(${amountUsdc} USDC). New balance: ${updatedCredits}`
  );

  // If the balance was low before top-up and notify_email is set, consider
  // sending a "top-up received" notification (optional — not in original plan).
  // For now, we just return success.

  // However, if even after top-up credits are still below threshold,
  // send low-balance email (edge case: very small top-up).
  if (
    updatedCredits < LOW_BALANCE_THRESHOLD &&
    plan.notify_email
  ) {
    sendLowBalanceEmail(plan.notify_email, updatedCredits, plan.usdc_address).catch((err) =>
      console.error("Failed to send low-balance email:", err)
    );

    await supabaseAdmin
      .from("user_plans")
      .update({ low_balance_notified_at: new Date().toISOString() })
      .eq("user_id", plan.user_id);
  }

  return NextResponse.json({ received: true, credits_added: newCredits, new_balance: updatedCredits });
}
