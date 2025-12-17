"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function createCheckoutSession(
  priceId: string,
  planName: string
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  const headersList = await headers();
  const origin = headersList.get("origin") || "http://localhost:3000";

  // Check if user already has a stripe customer id
  const { data: planData } = await supabase
    .from("user_plans")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
    metadata: {
      user_id: user.id,
      plan_name: planName,
    },
  };

  // If user already has a stripe customer, use it
  if (planData?.stripe_customer_id) {
    sessionParams.customer = planData.stripe_customer_id;
  } else {
    sessionParams.customer_email = user.email!;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (!session.url) {
    return { error: "Failed to create checkout session" };
  }

  return { url: session.url };
}
