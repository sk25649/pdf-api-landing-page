"use client";

import Link from "next/link";
import { Check, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const plans = [
  {
    name: "Free",
    price: 0,
    calls: 100,
    features: [
      "100 API calls/month",
      "Community support",
      "Basic documentation",
    ],
    cta: "Get Started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Starter",
    price: 19,
    calls: 1000,
    features: [
      "1,000 API calls/month",
      "Email support",
      "Full documentation",
      "Webhooks",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=starter",
    highlighted: true,
  },
  {
    name: "Pro",
    price: 49,
    calls: 5000,
    features: [
      "5,000 API calls/month",
      "Priority support",
      "Full documentation",
      "Webhooks",
      "Custom fonts",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=pro",
    highlighted: false,
  },
  {
    name: "Business",
    price: 99,
    calls: 20000,
    features: [
      "20,000 API calls/month",
      "Dedicated support",
      "Full documentation",
      "Webhooks",
      "Custom fonts",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "/signup?plan=business",
    highlighted: false,
  },
];

export function PricingTable() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, scale as you grow
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.highlighted
                  ? "border-primary shadow-lg ring-1 ring-primary"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="pt-8">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* AI Agent plan */}
        <div className="mx-auto mt-8 max-w-6xl">
          <div className="rounded-xl border bg-muted/30 p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">AI Agent plan</span>
                </div>
                <h3 className="text-xl font-bold">Pay-per-use with USDC</h3>
                <p className="max-w-xl text-sm text-muted-foreground">
                  For AI agents that register and pay programmatically. No monthly
                  commitment, no credit card. Register via{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    POST /api/register
                  </code>
                  , pay with USDC on Base, and get{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    X-Credits-Remaining
                  </code>{" "}
                  on every response so your software tops up automatically.
                </p>
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {[
                    "10 free calls on registration",
                    "50 credits per 1 USDC",
                    "No monthly commitment",
                    "Self-managing credit topup",
                    "Dedicated USDC wallet address",
                    "Optional low-balance email alert",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="shrink-0 space-y-3 md:text-right">
                <div>
                  <div className="text-4xl font-bold">$0.02</div>
                  <div className="text-sm text-muted-foreground">per API call</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">1 USDC = 50 credits</div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline">
                    <Link href="/docs#ai-agents">Read agent docs</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">Base mainnet · No signup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
