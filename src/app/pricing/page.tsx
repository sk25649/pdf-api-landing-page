import type { Metadata } from "next";
import { Check, Bot } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckoutButton } from "./CheckoutButton";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Doc API. Human plans from $0–$99/month. AI agents pay $0.02/call with USDC — no monthly commitment, register via API.",
  openGraph: {
    title: "Pricing - Doc API",
    description:
      "Human plans from $0–$99/month. AI agents pay $0.02/call with USDC — no monthly commitment.",
  },
};

const plans = [
  {
    name: "Free",
    price: 0,
    description: "For trying out the API",
    features: ["100 calls/month", "Community support"],
    priceId: null,
  },
  {
    name: "Starter",
    price: 19,
    description: "For small projects",
    features: ["1,000 calls/month", "Email support"],
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    popular: false,
  },
  {
    name: "Pro",
    price: 49,
    description: "For growing businesses",
    features: ["5,000 calls/month", "Priority support"],
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    popular: true,
  },
  {
    name: "Business",
    price: 99,
    description: "For large scale operations",
    features: ["20,000 calls/month", "Dedicated support"],
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    popular: false,
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
        <p className="text-muted-foreground text-lg">
          Monthly plans for humans. Pay-per-use USDC for AI agents.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-base font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.priceId ? (
                <CheckoutButton
                  priceId={plan.priceId}
                  planName={plan.name.toLowerCase()}
                  isLoggedIn={!!user}
                />
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Agent / Pay-per-use section */}
      <div className="mt-16 max-w-6xl mx-auto">
        <div className="rounded-xl border bg-muted/30 p-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">AI Agent plan</span>
              </div>
              <h2 className="text-2xl font-bold">Pay-per-use with USDC</h2>
              <p className="max-w-lg text-muted-foreground">
                Built for AI agents that register and pay programmatically. No monthly
                commitment, no credit card, no dashboard required. Register via API and
                pay with USDC on Base mainnet.
              </p>
              <ul className="space-y-2">
                {[
                  "Register via POST /api/register — one request, no human steps",
                  "3 free calls on registration — 10 free with email",
                  "50 credits per 1 USDC ($0.02/call)",
                  "X-Credits-Remaining header on every response",
                  "Self-managing: software tops up automatically via Coinbase AgentKit",
                  "Optional notify_email for human fallback alerts",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0 space-y-4 text-center md:text-right">
              <div>
                <div className="text-5xl font-bold">$0.02</div>
                <div className="text-muted-foreground">per API call</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  1 USDC = 50 credits
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild>
                  <Link href="/docs#ai-agents">Read the agent docs</Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  No signup required · Base mainnet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
