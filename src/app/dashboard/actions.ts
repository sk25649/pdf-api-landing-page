"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

function generateApiKey(): string {
  const hexChars = "0123456789abcdef";
  let result = "pk_";
  for (let i = 0; i < 46; i++) {
    result += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
  }
  return result;
}

export async function regenerateApiKey(): Promise<{ key: string } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  // Revoke existing keys
  const { error: revokeError } = await supabase
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("revoked_at", null);

  if (revokeError) {
    return { error: "Failed to revoke existing key" };
  }

  // Generate new key
  const newKey = generateApiKey();

  const { error: insertError } = await supabase.from("api_keys").insert({
    user_id: user.id,
    key: newKey,
  });

  if (insertError) {
    return { error: "Failed to create new key" };
  }

  revalidatePath("/dashboard");
  return { key: newKey };
}

export async function createBillingPortalSession(): Promise<
  { url: string } | { error: string }
> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  // Get stripe_customer_id from user_plans
  const { data: planData, error: planError } = await supabase
    .from("user_plans")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (planError || !planData?.stripe_customer_id) {
    return { error: "No billing account found" };
  }

  const headersList = await headers();
  const origin = headersList.get("origin") || "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: planData.stripe_customer_id,
    return_url: `${origin}/dashboard`,
  });

  return { url: session.url };
}
