import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Use service role key to bypass RLS
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables for webhook");
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Map Stripe price IDs to plan names
function getPlanFromPriceId(priceId: string): string {
  const priceToPlans: Record<string, string> = {
    [process.env.STRIPE_STARTER_PRICE_ID!]: "starter",
    [process.env.STRIPE_PRO_PRICE_ID!]: "pro",
    [process.env.STRIPE_BUSINESS_PRICE_ID!]: "business",
  };

  return priceToPlans[priceId] || "free";
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    console.error("No Stripe signature found");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.user_id;
        const planName = session.metadata?.plan_name;
        const customerId = session.customer as string;

        if (!userId || !planName) {
          console.error("Missing metadata in checkout session");
          return NextResponse.json(
            { error: "Missing metadata" },
            { status: 400 }
          );
        }

        const { error } = await supabaseAdmin.from("user_plans").upsert(
          {
            user_id: userId,
            plan: planName,
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        if (error) {
          console.error("Failed to update user plan:", error);
          return NextResponse.json(
            { error: "Failed to update plan" },
            { status: 500 }
          );
        }

        revalidatePath("/dashboard");
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0]?.price.id;

        if (!priceId) {
          console.error("No price ID found in subscription");
          break;
        }

        const newPlan = getPlanFromPriceId(priceId);

        const { error } = await supabaseAdmin
          .from("user_plans")
          .update({
            plan: newPlan,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Failed to update subscription:", error);
        } else {
          revalidatePath("/dashboard");
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { error } = await supabaseAdmin
          .from("user_plans")
          .update({
            plan: "free",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Failed to downgrade user plan:", error);
        } else {
          revalidatePath("/dashboard");
        }
        break;
      }
    }
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
