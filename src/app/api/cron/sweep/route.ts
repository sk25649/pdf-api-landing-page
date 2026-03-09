import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { CdpClient } from "@coinbase/cdp-sdk";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const USDC_CONTRACT = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDC_DECIMALS = 1_000_000; // 6 decimals
const CREDITS_PER_USDC = 50;
const MIN_SWEEP_AMOUNT = BigInt(500_000); // 0.5 USDC in atomic units

// Check USDC balance via RPC — no gas, no CDP SDK needed
async function getUsdcBalance(address: string, rpcUrl: string): Promise<bigint> {
  const padded = address.slice(2).toLowerCase().padStart(64, "0");
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_call",
      params: [{ to: USDC_CONTRACT, data: `0x70a08231${padded}` }, "latest"],
      id: 1,
    }),
  });
  const json = await res.json() as { result: string | null; error?: unknown };
  if (!json.result) throw new Error(`eth_call failed: ${JSON.stringify(json)}`);
  return BigInt(json.result);
}

export async function GET(request: NextRequest) {
  // Verify this is called by Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const treasury = process.env.TREASURY_USDC_ADDRESS as `0x${string}`;
  if (!treasury) {
    return NextResponse.json({ error: "TREASURY_USDC_ADDRESS not set" }, { status: 500 });
  }

  const rpcUrl = process.env.CDP_PAYMASTER_URL ?? "https://mainnet.base.org";

  // Fetch all agent wallets
  const { data: agents, error } = await supabaseAdmin
    .from("user_plans")
    .select("user_id, usdc_address, credits, usdc_credited_atomic")
    .eq("plan", "agent")
    .not("usdc_address", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: {
    address: string;
    credits_added: number;
    swept: string;
    txHash?: string;
    error?: string;
  }[] = [];

  for (const agent of agents ?? []) {
    try {
      // Check on-chain USDC balance via RPC (free, no gas needed)
      const balance = await getUsdcBalance(agent.usdc_address, rpcUrl);
      const lastCredited = BigInt(agent.usdc_credited_atomic ?? 0);
      const delta = balance - lastCredited;

      // Credit new USDC received since last run
      let creditsAdded = 0;
      if (delta > BigInt(0)) {
        creditsAdded = Math.floor(Number(delta) / USDC_DECIMALS * CREDITS_PER_USDC);
        if (creditsAdded > 0) {
          const { error: creditError } = await supabaseAdmin
            .from("user_plans")
            .update({
              credits: agent.credits + creditsAdded,
              usdc_credited_atomic: balance.toString(),
              low_balance_notified_at: null,
            })
            .eq("user_id", agent.user_id);

          if (creditError) {
            console.error(`Failed to credit ${agent.usdc_address}:`, creditError.message);
            results.push({ address: agent.usdc_address, credits_added: 0, swept: "0", error: creditError.message });
            continue;
          }
          console.log(`Credited ${creditsAdded} credits to ${agent.usdc_address} (${Number(delta) / USDC_DECIMALS} USDC new)`);
        }
      }

      // Attempt sweep if balance is above minimum
      if (balance < MIN_SWEEP_AMOUNT) {
        results.push({ address: agent.usdc_address, credits_added: creditsAdded, swept: "0" });
        continue;
      }

      const paymasterUrl = process.env.CDP_PAYMASTER_URL;
      try {
        const cdp = new CdpClient({
          apiKeyId: process.env.CDP_API_KEY_ID!,
          apiKeySecret: process.env.CDP_API_KEY_SECRET!,
          walletSecret: process.env.CDP_WALLET_SECRET!,
        });

        // Smart accounts need their owner (server account) to be retrieved first.
        // New agent wallets use naming convention: owner=agent-owner-{safeId}, smart=agent-{safeId}.
        // safeId = first 24 hex chars of UUID (strips hyphens), fits CDP 36-char name limit.
        // Legacy EOA wallets (no owner account) fall back to direct account retrieval.
        let txHash: string;
        try {
          const safeId = agent.user_id.replace(/-/g, "").slice(0, 24);
          const owner = await cdp.evm.getAccount({ name: `agent-owner-${safeId}` });
          const smartAccount = await cdp.evm.getSmartAccount({ owner, name: `agent-${safeId}` });
          const networkAccount = await smartAccount.useNetwork("base");
          const result = await networkAccount.transfer({
            to: treasury,
            amount: balance,
            token: "usdc" as const,
            ...(paymasterUrl ? { paymasterUrl } : {}),
          });
          txHash = result.userOpHash;
        } catch {
          // Legacy EOA wallet — no smart account, needs ETH for gas
          try {
            const account = await cdp.evm.getAccount({ address: agent.usdc_address });
            const networkAccount = await account.useNetwork("base");
            const result = await networkAccount.transfer({
              to: treasury,
              amount: balance,
              token: "usdc" as const,
            });
            txHash = result.transactionHash;
          } catch (eoaErr) {
            const eoaMsg = eoaErr instanceof Error ? eoaErr.message : String(eoaErr);
            throw new Error(
              `Legacy EOA wallet needs ETH for gas — fund ${agent.usdc_address} with ETH on Base to enable sweeping. (EOA error: ${eoaMsg})`
            );
          }
        }

        // Reset credited balance to 0 since wallet is now empty
        await supabaseAdmin
          .from("user_plans")
          .update({ usdc_credited_atomic: "0" })
          .eq("user_id", agent.user_id);

        // Record sweep for history/tax
        await supabaseAdmin.from("sweep_transactions").insert({
          user_id: agent.user_id,
          usdc_address: agent.usdc_address,
          amount_usdc: Number(balance) / USDC_DECIMALS,
          tx_hash: txHash,
        });

        results.push({ address: agent.usdc_address, credits_added: creditsAdded, swept: balance.toString(), txHash });
        console.log(`Swept ${Number(balance) / USDC_DECIMALS} USDC from ${agent.usdc_address} → treasury tx: ${txHash}`);
      } catch (sweepErr) {
        const msg = sweepErr instanceof Error ? sweepErr.message : String(sweepErr);
        console.warn(`Sweep failed for ${agent.usdc_address} (credits already applied): ${msg}`);
        results.push({ address: agent.usdc_address, credits_added: creditsAdded, swept: "0", error: `sweep failed: ${msg}` });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`Failed to process ${agent.usdc_address}:`, msg);
      results.push({ address: agent.usdc_address, credits_added: 0, swept: "0", error: msg });
    }
  }

  const totalCreditsAdded = results.reduce((sum, r) => sum + (r.credits_added ?? 0), 0);
  const totalSwept = results.reduce((sum, r) => sum + BigInt(r.swept ?? "0"), BigInt(0));

  return NextResponse.json({
    swept_wallets: results.filter((r) => r.txHash).length,
    total_usdc_swept: (Number(totalSwept) / USDC_DECIMALS).toFixed(6),
    total_credits_added: totalCreditsAdded,
    results,
  });
}
