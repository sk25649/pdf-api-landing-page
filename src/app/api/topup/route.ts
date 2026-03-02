import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "Missing x-api-key header" }, { status: 401 });
  }

  // Look up the API key
  const { data: keyData, error: keyError } = await supabaseAdmin
    .from("api_keys")
    .select("user_id")
    .eq("key", apiKey)
    .is("revoked_at", null)
    .single();

  if (keyError || !keyData) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  // Look up user_plans
  const { data: plan, error: planError } = await supabaseAdmin
    .from("user_plans")
    .select("credits, usdc_address, plan")
    .eq("user_id", keyData.user_id)
    .single();

  if (planError || !plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  if (plan.plan !== "agent") {
    return NextResponse.json(
      { error: "This endpoint is for agent accounts only" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    credits: plan.credits,
    usdc_address: plan.usdc_address,
    rate: "$0.02 per call (50 credits per USDC)",
    suggested_topup_usdc: 10,
  });
}
