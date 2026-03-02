import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { CdpClient } from "@coinbase/cdp-sdk";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// USDC on Base Mainnet has 6 decimals. Minimum balance to sweep: 0.5 USDC
const USDC_TOKEN = "usdc" as const;
const MIN_SWEEP_AMOUNT = BigInt(500_000); // 0.5 USDC in atomic units

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

  const cdp = new CdpClient({
    apiKeyId: process.env.CDP_API_KEY_ID!,
    apiKeySecret: process.env.CDP_API_KEY_SECRET!,
    walletSecret: process.env.CDP_WALLET_SECRET!,
  });

  // Fetch all agent wallets
  const { data: agents, error } = await supabaseAdmin
    .from("user_plans")
    .select("user_id, usdc_address, credits")
    .eq("plan", "agent")
    .not("usdc_address", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const CREDITS_PER_USDC = 50;
  const results: { address: string; swept: string; credits_added: number; txHash?: string; error?: string }[] = [];

  for (const agent of agents ?? []) {
    try {
      const account = await cdp.evm.getAccount({ address: agent.usdc_address });
      const networkAccount = await account.useNetwork("base");

      // Check USDC balance
      const { balances } = await networkAccount.listTokenBalances({});
      const usdcBalance = balances.find(
        (b) => b.token.symbol?.toLowerCase() === "usdc"
      );

      const amount = usdcBalance?.amount.amount ?? BigInt(0);

      if (amount < MIN_SWEEP_AMOUNT) {
        results.push({ address: agent.usdc_address, swept: "0", credits_added: 0 });
        continue;
      }

      // Credit the account before sweeping
      const amountUsdc = Number(amount) / 1_000_000;
      const creditsToAdd = Math.floor(amountUsdc * CREDITS_PER_USDC);
      const { error: creditError } = await supabaseAdmin
        .from("user_plans")
        .update({
          credits: agent.credits + creditsToAdd,
          low_balance_notified_at: null,
        })
        .eq("user_id", agent.user_id);

      if (creditError) {
        console.error(`Failed to credit ${agent.usdc_address}:`, creditError.message);
        results.push({ address: agent.usdc_address, swept: "0", credits_added: 0, error: creditError.message });
        continue;
      }

      // Sweep to treasury
      const { transactionHash } = await networkAccount.transfer({
        to: treasury,
        amount,
        token: USDC_TOKEN,
      });

      results.push({ address: agent.usdc_address, swept: amount.toString(), credits_added: creditsToAdd, txHash: transactionHash });
      console.log(`Swept ${amountUsdc} USDC from ${agent.usdc_address} → treasury, credited ${creditsToAdd} credits. tx: ${transactionHash}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`Failed to sweep ${agent.usdc_address}:`, msg);
      results.push({ address: agent.usdc_address, swept: "0", credits_added: 0, error: msg });
    }
  }

  const totalSwept = results.reduce((sum, r) => sum + BigInt(r.swept ?? "0"), BigInt(0));

  const totalCreditsAdded = results.reduce((sum, r) => sum + (r.credits_added ?? 0), 0);

  return NextResponse.json({
    swept_wallets: results.filter((r) => r.txHash).length,
    total_usdc_swept: (Number(totalSwept) / 1_000_000).toFixed(6),
    total_credits_added: totalCreditsAdded,
    results,
  });
}
